import {useEffect} from 'react';
import {FFmpeg} from '@ffmpeg/ffmpeg';

import {loadCollections, loadFFmpeg, loadScenarioPresets} from '../utils';
import {useStore} from '../store';

export const useLoadInitialData = () => {
    const store = useStore();
    useEffect(() => {
        const loadCollectionsData = async () => {
            store.collections = await loadCollections();
        };
        const loadPresetsData = async () => {
            store.presets = await loadScenarioPresets();
        };
        const initFfmpeg = async () => {
            const ffmpeg = new FFmpeg();
            await loadFFmpeg(ffmpeg);
            store.ffmpeg = ffmpeg;
        };
        Promise.all([
            loadCollectionsData(),
            loadPresetsData(),
            initFfmpeg(),
        ]);
    }, []);
}
