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
                ffmpeg.on("log", ({message, type}) => {
                    switch (type) {
                        case 'stderr':
                            console.error('log', message);
                            break;
                        default:
                            console.log('log', message, type);
                    }
                });

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
            // videoRef.current.src = URL.createObjectURL(new Blob([fetchedFile.buffer], {type: 'video/mp4'}));
            
            setDecodingStatus('feeding source video to ffmpeg...');
            await ffmpeg.writeFile('input.mp4', fetchedFile);
            console.log(await ffmpeg.listDir('.'));
            
            setDecodingStatus('converting video...');
            ffmpeg.on("progress", updateDecodingStatus);
            await ffmpeg.exec(['-i', 'input.mp4', 'output.mp4']);
            ffmpeg.off("progress", updateDecodingStatus);
            
            setDecodingStatus('reading output video...');
            const data = await ffmpeg.readFile('output.mp4') as Uint8Array;
            
            setDecodingStatus('previewing video...');
            videoRef.current.src = URL.createObjectURL(new Blob([data.buffer], {type: 'video/mp4'}));
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
