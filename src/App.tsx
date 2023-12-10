import {useEffect, useRef, useState} from 'react';
import {FFmpeg} from '@ffmpeg/ffmpeg';
import {fetchFile, toBlobURL} from '@ffmpeg/util';

const baseURL = 'https://unpkg.com/@ffmpeg/core-mt@0.12.7/dist/umd';

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

export const App = () => {
    const ffmpegRef = useRef(new FFmpeg());
    const videoRef = useRef<HTMLVideoElement>(null);

    const [isDecoding, setIsDecoding] = useState(false);
    const [decodingStatus, setDecodingStatus] = useState('');
    const {isLoaded: isFfmpegLoaded} = usePrepareFfmpeg(ffmpegRef.current);
    
    console.log('isFfmpegLoaded', isFfmpegLoaded);

    useEffect(() => {
        (async () => {
            console.log(isDecoding, isFfmpegLoaded, ffmpegRef.current, videoRef.current);
            if (isDecoding || !isFfmpegLoaded || !ffmpegRef.current || !videoRef.current) {
                console.log('return');
                return;
            }
            
            const ffmpeg = ffmpegRef.current;

            console.log('start');
            setIsDecoding(true);
            setDecodingStatus('loading source video...');
            const fetchedFile = await fetchFile('tinkoff_output.mp4');
            setDecodingStatus('feeding source video to ffmpeg...');
            await ffmpeg.writeFile('input.mp4', fetchedFile);
            setDecodingStatus('converting video...');
            await ffmpeg.exec(['-i', 'input.mp4', 'output.mp4']);
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
            <video ref={videoRef}></video>
        </div>
    );
};
