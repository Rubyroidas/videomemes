import {useEffect, useState} from 'react';
import {FFmpeg} from '@ffmpeg/ffmpeg';

import {
    consoleError,
    consoleLog,
    loadCollectionsAndScenarioPresets,
    loadFFMpeg,
} from '../utils';
import {useStore} from '../store';

export const useLoadInitialData = () => {
    const store = useStore();
    const [failedBrowser, setFailedBrowser] = useState(false);
    useEffect(() => {
        const loadContentData = async () => {
            const {collections, scenarios} = await loadCollectionsAndScenarioPresets();
            store.collections = collections;
            store.presets = scenarios.flat();
        };
        const initFfmpeg = async () => {
            const ffmpeg = new FFmpeg();
            try {
                consoleLog('ffmpeg: start loading...');
                await loadFFMpeg(ffmpeg);
                consoleLog('ffmpeg: loaded');
            } catch (e) {
                setFailedBrowser(true);
                consoleError('ffmpeg: not loaded', e);
            }
            store.ffmpeg = ffmpeg;
        };
        Promise.all([
            loadContentData(),
            initFfmpeg(),
        ]);
    }, []);

    return {failedBrowser};
};
