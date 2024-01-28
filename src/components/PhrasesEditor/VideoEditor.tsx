import {FC, useCallback, useState} from 'react';
import {useNavigate} from 'react-router-dom';

import {Button} from '../App.styles';
import {PhrasesEditor} from './PhrasesEditor';
import {Format, UserPhrase} from '../../types';
import {generateVideo} from '../../generate';
import {Icon} from './PhraseEditor.styles';
import {PlayIcon} from '../../icons/PlayIcon';
import {EditListIcon} from '../../icons/EditListIcon';
import {useStore} from '../../store';

export const VideoEditor: FC = () => {
    const store = useStore();
    const navigate = useNavigate();

    const userPhrases = store.scenario?.phrases;
    const [isEncoding, setIsEncoding] = useState(false);
    const format = store.scenario?.format ?? Format.InstagramStory;

    const setUserPhrases = useCallback((value: UserPhrase[]) => {
        if (store.scenario) {
            store.scenario.phrases = value;
        }
    }, []);
    const handleGenerateClick = useCallback(() => {
        (async () => {
            if (isEncoding || !userPhrases) {
                return;
            }

            setIsEncoding(true);
            console.log('start generate');
            const vid = await generateVideo(
                store.ffmpeg!,
                userPhrases,
                store.collections!,
                format
            );
            store.generatedVideo = vid;
            console.log('end generate');
            setIsEncoding(false);
            navigate('/download-result');
        })();
    }, []);
    const handleEditScenario = useCallback(() => {
        navigate('/edit-scenario');
    }, []);

    if (!userPhrases) {
        return null;
    }

    return (
        <>
            <div className="buttons">
                <Button onClick={handleEditScenario}>
                    <Icon>
                        <EditListIcon/>
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
            </div>
            <PhrasesEditor
                disabled={isEncoding}
                userPhrases={userPhrases}
                format={format}
                onChange={setUserPhrases}
            />
        </>
    );
}
