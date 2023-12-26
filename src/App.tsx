import {useRef} from 'react';
import {FFmpeg} from '@ffmpeg/ffmpeg';

import {VideoEditor} from './components/VideoEditor';
import {usePrepareFfmpeg} from './hooks';
import {AppTitle} from './App.styles';

export const App = () => {
    const ffmpegRef = useRef(new FFmpeg());
    const {isLoaded} = usePrepareFfmpeg(ffmpegRef.current);

    return (
        <div>
            <AppTitle>Video meme generator</AppTitle>
            {!isLoaded ? (
                <div>Loading...</div>
            ) : (
                <VideoEditor ffmpeg={ffmpegRef.current}/>
            )}
        </div>
    );
};
