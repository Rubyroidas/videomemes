import {FC, useCallback, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {observer} from 'mobx-react';

import {Button} from '../App.styles';
import {PhrasesEditor} from './PhrasesEditor';
import {generateVideo} from '../../generate';
import {Icon} from './PhraseEditor.styles';
import {PlayIcon} from '../../icons/PlayIcon';
import {EditListIcon} from '../../icons/EditListIcon';
import {useStore} from '../../store';
import {ProgressCurtain} from './ProgressCurtain';
import {useApi} from '../../services/apiContext';
import {UserPhraseType} from '../../types';
import {consoleLog} from '../../utils';

export const VideoEditor: FC = observer(() => {
    const store = useStore();
    const api = useApi();
    const navigate = useNavigate();

    const [isEncoding, setIsEncoding] = useState(false);
    consoleLog('store.scenario.title', store.scenario?.title);

    const handleGenerateClick = useCallback(() => {
        const doGenerate = async () => {
            if (isEncoding || !store.scenario || !store.collections) {
                return;
            }

            setIsEncoding(true);
            consoleLog('start generate');
            const vid = await generateVideo(
                store.ffmpeg!,
                store.scenario.title,
                store.scenario.phrases,
                store.collections,
                store.scenario.format
            );
            store.generatedVideo = vid;
            consoleLog('end generate', vid);

            // upload scenario and file, or timeout - what comes first
            await api.uploadScenarioAndFile(store.scenario, store.generatedVideo);

            setIsEncoding(false);
            navigate('/download-result');
        };

        doGenerate();
    }, []);
    const handleEditScenario = useCallback(() => {
        navigate('/edit-scenario');
    }, []);

    if (!store.scenario?.phrases) {
        return null;
    }

    const canGenerate = store.scenario.phrases.every(
        phrase =>
            phrase.type === UserPhraseType.PlainText
            || phrase.type === UserPhraseType.PlainImage && phrase.image !== undefined
    );

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
                    <Button onClick={handleGenerateClick} disabled={!canGenerate}>
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
});
