import {FFmpeg} from '@ffmpeg/ffmpeg';
import {useEffect, useState} from 'react';
import {toBlobURL} from '@ffmpeg/util';

import {Collection} from './types';

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

export const useLoadCollections = () => {
    const [collections, setCollections] = useState<Collection[] | null>(null);

    useEffect(() => {
        const load = async () => {
            const res = await fetch('tinkoff-vertical.json');
            setCollections([await res.json()]);
        };
        load();
    }, []);

    return {collections};
}
