import {useEffect, useState} from 'react';
import {FFmpeg} from '@ffmpeg/ffmpeg';

import {consoleError, consoleLog, loadCollections, loadFFMpeg, loadScenarioPresets} from '../utils';
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
            loadCollectionsData(),
            loadPresetsData(),
            initFfmpeg(),
        ]);
    }, []);

    return {failedBrowser};
};
