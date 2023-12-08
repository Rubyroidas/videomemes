import {useEffect, useRef, useState} from 'react';
import {FFmpeg} from '@ffmpeg/ffmpeg';
import {fetchFile, toBlobURL} from '@ffmpeg/util';

const usePrepareFfmpeg = (ffmpeg: FFmpeg) => {
    const [isLoaded, setIsLoaded] = useState(false);

    // load ffmpeg itself
    useEffect(() => {
        (async () => {
            await ffmpeg.load({
                coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
                wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
            });
            setIsLoaded(true);
        })();
    }, []);
    
    return {isLoaded};
};

const useLoadVideoBinary = (url: string) => {
    const [data, setData] = useState<Blob | null>(null);
    useEffect(() => {
        fetch(url)
            .then(res => res.blob())
            .then(blob => {
                setData(blob);
            });
    }, [url]);
    return {data};
};

const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.4/dist/umd';

export const App = () => {
    const {data: videoTemplate} = useLoadVideoBinary('tinkoff_output.mp4');
    const [isDecoding, setIsDecoding] = useState(false);
    const ffmpegRef = useRef(new FFmpeg());
    const {isLoaded: isFfmpegLoaded} = usePrepareFfmpeg(ffmpegRef.current);

    console.log('data', videoTemplate, isFfmpegLoaded);
    
    useEffect(() => {
        (async () => {
            if (!videoTemplate || isDecoding || !isFfmpegLoaded || !ffmpegRef.current) {
                return;
            }
            
            const ffmpeg = ffmpegRef.current;

            setIsDecoding(true);
            ffmpeg.on('log', ({ message }) => {
                console.log('log', message);
            });
            const fetchedFile = await fetchFile(videoTemplate);
            // await ffmpeg.load({
            //    
            // })
            console.log(fetchedFile);
            setIsDecoding(false);
        })();
    }, [videoTemplate, isFfmpegLoaded]);
    
    return (
        <div>Video meme generator app</div>
    );
};
