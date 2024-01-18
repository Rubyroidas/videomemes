import {useEffect} from 'react';
import {FFmpeg} from '@ffmpeg/ffmpeg';

import {loadCollections, loadFFmpeg} from '../utils';
import {useStore} from '../store';

export const useLoadInitialData = () => {
    const store = useStore();
    useEffect(() => {
        const loadCollectionsData = async () => {
            store.collections = await loadCollections();
        };
        const initFfmpeg = async () => {
            const ffmpeg = new FFmpeg();
            await loadFFmpeg(ffmpeg);
            store.ffmpeg = ffmpeg;
        };
        Promise.all([loadCollectionsData(), initFfmpeg()]);
    }, []);
}
