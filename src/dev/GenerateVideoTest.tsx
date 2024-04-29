import {useRef, useState} from 'react';
import shortUuid from 'short-uuid';

import {generateVideo} from '../generate';
import {Format, UserPhrase, UserPhraseType} from '../types';
import {useStore} from '../store';

const userPhrases: UserPhrase[] = [
    {
        id: shortUuid().uuid(),
        collectionId: 'tinkoff',
        fragmentId: 1,
        textSize: 1,
        text: 'first text',
        imageSize: 1,
        type: UserPhraseType.PlainText,
    },
    {
        id: shortUuid().uuid(),
        collectionId: 'tinkoff',
        fragmentId: 2,
        textSize: 1,
        text: 'second text',
        imageSize: 1,
        type: UserPhraseType.PlainText,
    },
];

export const GenerateVideoTest = () => {
    const store = useStore();
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [progress, setProgress] = useState(0);
    const handleGenerate = async (includeTitle: boolean) => {
        if (!videoRef.current || !store.ffmpeg) {
            return;
        }
        const blob = await generateVideo(
            store.ffmpeg,
            includeTitle ? 'Hello, world' : undefined,
            userPhrases,
            store.collections!,
            Format.InstagramPost,
            setProgress
        );
        const dataurl = URL.createObjectURL(blob);
        videoRef.current.src = dataurl;
    };

    return (
        <div>
            GenerateVideoTest
            <button onClick={() => handleGenerate(false)}>Generate no title</button>
            <button onClick={() => handleGenerate(true)}>Generate with title</button>
            <div>
                progress: {(progress * 100).toFixed(2)}%
            </div>
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
