import {useRef} from 'react';
import {FFmpeg} from '@ffmpeg/ffmpeg';

import {VideoEditor} from './components/VideoEditor';
import {useLoadCollections, usePrepareFfmpeg} from './hooks';
import {AppTitle} from './App.styles';

export const App = () => {
    const ffmpegRef = useRef(new FFmpeg());
    const {isLoaded} = usePrepareFfmpeg(ffmpegRef.current);
    const {collections} = useLoadCollections();

    return (
        <div>
            <AppTitle>Video meme generator</AppTitle>
            {!isLoaded || !collections ? (
                <div>Loading...</div>
            ) : (
                <VideoEditor
                    ffmpeg={ffmpegRef.current}
                    collections={collections}
                />
            )}
        </div>
    );
};
