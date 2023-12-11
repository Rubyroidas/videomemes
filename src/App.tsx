import {useEffect, useRef, useState} from 'react';
import {FFmpeg} from '@ffmpeg/ffmpeg';
import {fetchFile, toBlobURL} from '@ffmpeg/util';

interface ProgressEvent {
    progress: number;
    time: number;
}

const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.4/dist/esm';

const usePrepareFfmpeg = (ffmpeg: FFmpeg) => {
    const [isLoaded, setIsLoaded] = useState(false);

    // load ffmpeg itself
    useEffect(() => {
        (async () => {
            try {
                console.log('loading ffmpeg...');
                await ffmpeg.load({
                    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
                    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
                    workerURL: await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`, 'text/javascript'),
                });
                console.log('loaded');
                setIsLoaded(true);
            } catch (e) {
                console.error('not loaded', e);
            }
        })();
    }, []);
    
    return {isLoaded};
};

const templateFile = 'tinkoff_output.mp4';

const ffmpegExec = async (ffmpeg: FFmpeg, args: string[], progressCallback?: (e: ProgressEvent) => void) => {
    const logs: Record<string, string[]> = {};

    ffmpeg.on('log', ({message, type}) => {
        if (!logs[type]) {
            logs[type] = [];
        }
        logs[type].push(message);
    });
    if (progressCallback) {
        ffmpeg.on('progress', progressCallback);
    }
    await ffmpeg.exec(args);
    if (progressCallback) {
        ffmpeg.off('progress', progressCallback);
    }
    return Object.fromEntries(
        Object.entries(logs)
            .map(([k, v]) => [k, v.join('\n')])
    );
};

interface VideoProperties {
    fps: number;
}
const getVideoProperties = async (ffmpeg: FFmpeg, fileName: string): Promise<VideoProperties> => {
    const result: VideoProperties = {
        fps: 0,
    };
    const infoResult = await ffmpegExec(ffmpeg, ['-i', fileName]);
    const match = /(\d+)\sfps/i.exec(infoResult.stderr);
    if (match?.[1]) {
        result.fps = parseInt(match[1], 10);
    }
    return result;
}

const listFiles = async (ffmpeg: FFmpeg, path: string)=>
    (await ffmpeg.listDir(path)).filter(p => !(['.', '..'].includes(p.name) && p.isDir));

export const App = () => {
    const ffmpegRef = useRef(new FFmpeg());
    const videoRef = useRef<HTMLVideoElement>(null);

    const [isDecoding, setIsDecoding] = useState(false);
    const [decodingStatus, setDecodingStatus] = useState('');
    const {isLoaded: isFfmpegLoaded} = usePrepareFfmpeg(ffmpegRef.current);
    
    console.log('%cdecodingStatus', 'color: pink', decodingStatus);

    useEffect(() => {
        (async () => {
            if (isDecoding || !isFfmpegLoaded || !ffmpegRef.current || !videoRef.current) {
                console.log('return');
                return;
            }
            
            const ffmpeg = ffmpegRef.current;
            const updateDecodingStatus = ({progress, time}: ProgressEvent) => {
                console.log('progress', progress, time);
                setDecodingStatus(`converting video... ${(progress * 100).toFixed(2)}%`);
            };

            console.log('start');
            setIsDecoding(true);
            setDecodingStatus('loading source video...');
            const fetchedFile = await fetchFile(templateFile);
            videoRef.current.src = URL.createObjectURL(new Blob([fetchedFile.buffer], {type: 'video/mp4'}));
            
            setDecodingStatus('feeding source video to ffmpeg...');
            await ffmpeg.writeFile('input.mp4', fetchedFile);

            setDecodingStatus('extracting frames...');
            
            // pics
            await ffmpeg.createDir('pics');
            const splitPicsResult = await ffmpegExec(ffmpeg, '-y -i input.mp4 -qscale:v 8 pics/%05d.jpg'.split(' '), updateDecodingStatus);
            console.log('splitPicsResult', splitPicsResult.stderr);
            
            // mp3
            await ffmpegExec(ffmpeg, ['-i', 'input.mp4', '-vn', '-f', 'mp3', 'output.mp3']);
            
            // info
            const videoProperties = await getVideoProperties(ffmpeg, 'input.mp4');
            console.log('infoResult', videoProperties);
            
            // await ffmpeg.exec(['-i', 'input.mp4', '-vn', '-f', 'mp3', 'output.mp3']);
            console.log('dir [.]', await listFiles(ffmpeg, '.'));
            console.log('dir [pics]', await listFiles(ffmpeg, 'pics'));
            console.log('dir [captions]', await listFiles(ffmpeg, 'pics'));
            
            // setDecodingStatus('reading output video...');
            // const data = await ffmpeg.readFile('output.mp4') as Uint8Array;
            
            // setDecodingStatus('previewing video...');
            // videoRef.current.src = URL.createObjectURL(new Blob([data.buffer], {type: 'video/mp4'}));
            setDecodingStatus('ready 👌');
            
            setIsDecoding(false);
        })();
    }, [isFfmpegLoaded]);
    
    return (
        <div>
            <h4>Video meme generator app</h4>
            <div>Decoding status: {decodingStatus}</div>
            <video controls={true} ref={videoRef}></video>
        </div>
    );
};
