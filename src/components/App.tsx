import {useEffect} from 'react';
import {FFmpeg} from '@ffmpeg/ffmpeg';
import {observer} from 'mobx-react';

import {VideoEditor} from './VideoEditor';
import {AppTitle} from './App.styles';
import {loadCollections, loadFFmpeg} from '../utils';
import {useStore} from '../store';

export const App = observer(() => {
    const store = useStore();
    useEffect(() => {
        const load = async () => {
            store.collections = await loadCollections();
        };
        load();
    }, []);
    useEffect(() => {
        const load = async () => {
            const ffmpeg = new FFmpeg();
            await loadFFmpeg(ffmpeg);
            store.ffmpeg = ffmpeg;
        };
        load();
    }, []);

    return (
        <div>
            <AppTitle>Video meme generator</AppTitle>
            {!store.ffmpeg || !store.collections ? (
                <div>Loading...</div>
            ) : (
                <VideoEditor/>
            )}
        </div>
    );
});
