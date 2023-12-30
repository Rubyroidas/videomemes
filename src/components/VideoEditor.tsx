import {FC, useEffect, useRef, useState} from 'react';
import {FFmpeg} from '@ffmpeg/ffmpeg';

import {PhraseEditor} from '../PhraseEditor';
import {ProgressBar} from '../ProgressBar';
import {DownloadVideoButton} from '../DownloadVideoButton';

import {Button} from '../App.styles';
import {Collection, UserPhrase} from '../types';
import {generateVideo} from '../utils';

type Props = {
    ffmpeg: FFmpeg;
    collections: Collection[];
}

const debugUserPhrases: UserPhrase[] = [{
    collectionId: 'tinkoff-vertical',
    phraseId: 1,
    text: 'hello world',
}, {
    collectionId: 'tinkoff-vertical',
    phraseId: 2,
    text: 'hello world 2',
}, {
    collectionId: 'tinkoff-vertical',
    phraseId: 3,
    text: 'hello world 3',
}];

export const VideoEditor: FC<Props> = ({ffmpeg, collections}) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    const [userPhrases, setUserPhrases] = useState<UserPhrase[]>(debugUserPhrases);
    const [isDecoding, setIsDecoding] = useState(false);
    const [decodingProgress, setDecodingProgress] = useState(0);
    const [decodingStatus, setDecodingStatus] = useState('');
    const [generatedVideo, setGeneratedVideo] = useState<Blob | null>(null);

    const handleGenerateClick = () => {
        (async () => {
            if (isDecoding || !videoRef.current) {
                console.log('return');
                return;
            }

            setIsDecoding(true);
            console.log('start generate');
            const vid = await generateVideo(ffmpeg, userPhrases, collections, setDecodingProgress, setDecodingStatus);
            setGeneratedVideo(vid);
            console.log('end generate');
            setIsDecoding(false);
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
            <div>Encoding status: {decodingStatus}</div>
            <PhraseEditor
                disabled={isDecoding}
                collections={collections}
                userPhrases={userPhrases}
                onChange={setUserPhrases}
            />
            {!isDecoding && (
                <Button onClick={handleGenerateClick}>Generate</Button>
            )}
            {isDecoding && (
                <ProgressBar value={decodingProgress}/>
            )}
            {generatedVideo && (
                <div>
                    <DownloadVideoButton data={generatedVideo}/>
                </div>
            )}
            <video controls={true} ref={videoRef} style={{
                display: !generatedVideo ? 'none' : ''
            }}></video>
            {/*<video controls={true} src="./tinkoff_3.mp4"></video>*/}
        </>
    );
}
