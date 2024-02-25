import {useRef} from 'react';

import {generateVideoTitleVideo} from '../generate';
import {Format} from '../types';
import {useStore} from '../store';

export const GenerateTitleVideoTest = () => {
    const store = useStore();
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const handleGenerate = async () => {
        if (!videoRef.current || !store.ffmpeg) {
            return;
        }
        const ffmpeg = store.ffmpeg;
        await generateVideoTitleVideo(ffmpeg, 'Hello, world', Format.InstagramPost, 'video_title.mp4', 2);

        const data = await ffmpeg.readFile('video_title.mp4') as Uint8Array;
        const blob = new Blob([data.buffer], {type: 'video/mp4'});
        const dataurl = URL.createObjectURL(blob);
        videoRef.current.src = dataurl;
    };

    return (
        <div>
            GenerateTitleVideoTest
            <button onClick={handleGenerate}>Generate w/o title</button>
            <div>
                <video
                    ref={videoRef}
                    controls={true}
                    loop={false}
                    disablePictureInPicture={true}
                    disableRemotePlayback={true}
                    controlsList="nofullscreen"
                    playsInline={true}
                    preload="auto"
                    crossOrigin="anonymous"
                />
            </div>
        </div>
    )
};
