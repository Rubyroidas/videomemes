import {useEffect, useState} from 'react';
import {FFmpeg} from '@ffmpeg/ffmpeg';

import {loadCollections, loadFFMpeg, loadScenarioPresets} from '../utils';
import {useStore} from '../store';

export const useLoadInitialData = () => {
    const store = useStore();
    const [failedBrowser, setFailedBrowser] = useState(false);
    useEffect(() => {
        const loadCollectionsData = async () => {
            store.collections = await loadCollections();
        };
        const loadPresetsData = async () => {
            store.presets = await loadScenarioPresets();
        };
        const initFfmpeg = async () => {
            const ffmpeg = new FFmpeg();
            try {
                if (__DEV__) {
                    console.log('ffmpeg: start loading...');
                }
                await loadFFMpeg(ffmpeg);
                if (__DEV__) {
                    console.log('ffmpeg: loaded');
                }
            } catch (e) {
                setFailedBrowser(true);
                if (__DEV__) {
                    console.error('ffmpeg: not loaded', e);
                }
            }
            store.ffmpeg = ffmpeg;
        };
        Promise.all([
            loadCollectionsData(),
            loadPresetsData(),
            initFfmpeg(),
        ]);
    }, []);

    return {failedBrowser};
};
