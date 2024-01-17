import {FC, useEffect, useRef, useState} from 'react';

import {PhrasesEditor} from './PhrasesEditor';
import {DownloadVideoButton} from './DownloadVideoButton';

import {Button} from './App.styles';
import {Format, TextSize, UserPhrase} from '../types';
import {generateVideo} from '../generate';
import {Icon} from './PhraseEditor.styles';
import {PlayIcon} from '../icons/PlayIcon';
import {DownloadIcon} from '../icons/DownloadIcon';
import {useStore} from '../store';

const debugUserPhrases: UserPhrase[] = [
    {
        collectionId: 'tinkoff',
        phraseId: 1,
        text: 'You decide to search for the\nnew job',
        textSize: TextSize.Normal,
        imageSize: 1,
    },
    {
        collectionId: 'tinkoff',
        phraseId: 2,
        text: 'hello world 2',
        textSize: TextSize.Normal,
        imageSize: 1,
    },
    {
        collectionId: 'tinkoff',
        phraseId: 3,
        text: 'hello world 3',
        textSize: TextSize.Normal,
        imageSize: 1,
    },
];

export const VideoEditor: FC = () => {
    const store = useStore();
    const videoRef = useRef<HTMLVideoElement>(null);

    const [userPhrases, setUserPhrases] = useState<UserPhrase[]>(debugUserPhrases);
    // @ts-ignore
    const [format, setFormat] = useState(Format.YoutubeVideo);
    const [isEncoding, setIsEncoding] = useState(false);
    const [generatedVideo, setGeneratedVideo] = useState<Blob | null>(null);

    const handleGenerateClick = () => {
        (async () => {
            if (isEncoding || !videoRef.current) {
                console.log('return');
                return;
            }

            setIsEncoding(true);
            console.log('start generate');
            const vid = await generateVideo(
                store.ffmpeg!,
                userPhrases,
                store.collections!,
                format,
                () => {}, () => {}
            );
            setGeneratedVideo(vid);
            console.log('end generate');
            setIsEncoding(false);
        })();
    };

    useEffect(() => {
        if (!videoRef.current || !generatedVideo) {
            return;
        }

        videoRef.current.src = URL.createObjectURL(generatedVideo);
    }, [generatedVideo]);

    return (
        <>
            <div className="buttons">
            {!isEncoding && (
                <Button onClick={handleGenerateClick}>
                    <Icon>
                        <PlayIcon/>
                    </Icon>
                    Generate
                </Button>
            )}
            {generatedVideo && !isEncoding && (
                <DownloadVideoButton data={generatedVideo}>
                    <Icon>
                        <DownloadIcon/>
                    </Icon>
                    Download
                </DownloadVideoButton>
            )}
            </div>
            <PhrasesEditor
                disabled={isEncoding}
                userPhrases={userPhrases}
                format={format}
                onChange={setUserPhrases}
            />
            <video controls={true} ref={videoRef} style={{
                display: !generatedVideo || isEncoding ? 'none' : ''
            }}></video>
        </>
    );
}
