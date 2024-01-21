import {FC, useEffect, useRef, useState} from 'react';

import {PhrasesEditor} from './PhrasesEditor';
import {DownloadVideoButton} from './DownloadVideoButton';

import {Button} from './App.styles';
import {Format, UserPhrase} from '../types';
import {generateVideo} from '../generate';
import {Icon} from './PhraseEditor.styles';
import {PlayIcon} from '../icons/PlayIcon';
import {DownloadIcon} from '../icons/DownloadIcon';
import {useStore} from '../store';
import {useNavigate} from 'react-router-dom';

export const VideoEditor: FC = () => {
    const store = useStore();
    const navigate = useNavigate();
    const videoRef = useRef<HTMLVideoElement>(null);

    const userPhrases = store.scenario?.phrases;
    const setUserPhrases = (value: UserPhrase[]) => {
        if (store.scenario) {
            store.scenario.phrases = value;
        }
    }
    // @ts-ignore
    const [isEncoding, setIsEncoding] = useState(false);
    const [generatedVideo, setGeneratedVideo] = useState<Blob | null>(null);
    const format = store.scenario?.format ?? Format.InstagramStory;

    const handleGenerateClick = () => {
        (async () => {
            if (isEncoding || !videoRef.current || !userPhrases) {
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
    const handleEditScenario = () => {
        navigate('/edit-scenario');
    };

    useEffect(() => {
        if (!videoRef.current || !generatedVideo) {
            return;
        }

        videoRef.current.src = URL.createObjectURL(generatedVideo);
    }, [generatedVideo]);

    if (!userPhrases) {
        return null;
    }

    return (
        <>
            <div className="buttons">
            <Button onClick={handleEditScenario}>
                <Icon>
                    <PlayIcon/>
                </Icon>
                Edit scenario
            </Button>
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
