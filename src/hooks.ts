import {FFmpeg} from '@ffmpeg/ffmpeg';
import {useEffect, useState} from 'react';
import {toBlobURL} from '@ffmpeg/util';

const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.4/dist/esm';

export const usePrepareFfmpeg = (ffmpeg: FFmpeg) => {
    const [isLoaded, setIsLoaded] = useState(false);

    // load ffmpeg itself
    useEffect(() => {
        (async () => {
            try {
                console.log('loading ffmpeg...');
                await ffmpeg.load({
                    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
                    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
                    // workerURL: await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`, 'text/javascript'),
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
