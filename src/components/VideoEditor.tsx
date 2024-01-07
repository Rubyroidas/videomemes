import {FC, useEffect, useRef, useState} from 'react';
import {FFmpeg} from '@ffmpeg/ffmpeg';

import {PhrasesEditor} from './PhraseEditor';
import {ProgressBar} from './ProgressBar';
import {DownloadVideoButton} from './DownloadVideoButton';

import {Button} from './App.styles';
import {Collection, UserPhrase} from '../types';
import {generateVideo} from '../generate';

type Props = {
    ffmpeg: FFmpeg;
    collections: Collection[];
}

const debugUserPhrases: UserPhrase[] = [{
    collectionId: 'tinkoff-vertical',
    phraseId: 1,
    text: 'You decide to search for the\nnew job',
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
    const [isEncoding, setIsEncoding] = useState(false);
    const [encoodingProgress, setEncoodingProgress] = useState(0);
    const [encodingStatus, setEncodingStatus] = useState('');
    const [generatedVideo, setGeneratedVideo] = useState<Blob | null>(null);

    const handleGenerateClick = () => {
        (async () => {
            if (isEncoding || !videoRef.current) {
                console.log('return');
                return;
            }

            setIsEncoding(true);
            console.log('start generate');
            const vid = await generateVideo(ffmpeg, userPhrases, collections, setEncoodingProgress, setEncodingStatus);
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
            {isEncoding && (
                <div>Encoding status: {encodingStatus}</div>
            )}
            <div className="buttons">
            {!isEncoding && (
                <Button onClick={handleGenerateClick}>Generate</Button>
            )}
            {generatedVideo && !isEncoding && (
                <DownloadVideoButton data={generatedVideo}/>
            )}
            </div>
            {isEncoding && (
                <ProgressBar value={encoodingProgress}/>
            )}
            <PhrasesEditor
                disabled={isEncoding}
                collections={collections}
                userPhrases={userPhrases}
                onChange={setUserPhrases}
            />
            <video controls={true} ref={videoRef} style={{
                display: !generatedVideo || isEncoding ? 'none' : ''
            }}></video>
            {/*<video controls={true} src="./tinkoff_3.mp4"></video>*/}
        </>
    );
}
