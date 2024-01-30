import {FC, useCallback, useState} from 'react';
import {useNavigate} from 'react-router-dom';

import {Button} from '../App.styles';
import {PhrasesEditor} from './PhrasesEditor';
import {generateVideo} from '../../generate';
import {Icon} from './PhraseEditor.styles';
import {PlayIcon} from '../../icons/PlayIcon';
import {EditListIcon} from '../../icons/EditListIcon';
import {useStore} from '../../store';
import {ProgressCurtain} from './ProgressCurtain';
import {useApi} from '../../services/apiContext';

export const VideoEditor: FC = () => {
    const store = useStore();
    const api = useApi();
    const navigate = useNavigate();

    const [isEncoding, setIsEncoding] = useState(false);

    const handleGenerateClick = useCallback(() => {
        (async () => {
            if (isEncoding || !store.scenario?.phrases || !store.scenario?.format || !store.collections) {
                return;
            }

            setIsEncoding(true);
            if (__DEV__) {
                console.log('start generate');
            }
            const vid = await generateVideo(
                store.ffmpeg!,
                store.scenario.phrases,
                store.collections,
                store.scenario.format
            );
            store.generatedVideo = vid;
            if (__DEV__) {
                console.log('end generate');
            }

            // upload scenario and file, or timeout - what comes first
            await api.uploadScenarioAndFile(store.scenario, store.generatedVideo);

            setIsEncoding(false);
            navigate('/download-result');
        })();
    }, []);
    const handleEditScenario = useCallback(() => {
        navigate('/edit-scenario');
    }, []);

    if (!store.scenario?.phrases) {
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
            />
            {isEncoding && (
                <ProgressCurtain/>
            )}
        </>
    );
};
