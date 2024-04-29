import {FC, useCallback, useRef, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {observer} from 'mobx-react';

import {Button} from '../App.styles';
import {FragmentsEditor} from './FragmentsEditor';
import {generateVideo} from '../../generate';
import {Icon} from './FragmentEditor.styles';
import {PlayIcon} from '../../icons/PlayIcon';
import {EditListIcon} from '../../icons/EditListIcon';
import {useStore} from '../../store';
import {ProgressCurtain} from './ProgressCurtain';
import {useApi} from '../../services/apiContext';
import {UserFragmentType} from '../../types';
import {consoleError, consoleLog} from '../../utils';

export const VideoEditor: FC = observer(() => {
    const store = useStore();
    const api = useApi();
    const navigate = useNavigate();

    const [isEncoding, setIsEncoding] = useState(false);
    const abortController = useRef<AbortController | null>(null);
    consoleLog('store.scenario.title', store.scenario?.title);

    const handleGenerateClick = useCallback(() => {
        const doGenerate = async () => {
            if (isEncoding || !store.scenario || !store.collections) {
                return;
            }

            setIsEncoding(true);
            consoleLog('start generate');
            abortController.current = new AbortController();
            try {
                const vid = await generateVideo(
                    store.ffmpeg!,
                    store.scenario.title,
                    store.scenario.fragments,
                    store.collections,
                    store.scenario.format,
                    () => {
                    },
                    abortController.current.signal
                );
                consoleLog('end generating', vid);
                if (!abortController.current?.signal.aborted) {
                    store.generatedVideo = vid;
                }

                // upload scenario and file, or timeout - what comes first
                if (!abortController.current?.signal.aborted) {
                    await api.uploadScenarioAndFile(store.scenario, store.generatedVideo!);
                    consoleLog('end uploading', vid);
                }
                if (!abortController.current?.signal.aborted) {
                    navigate('/download-result');
                }
            } catch (e) {
                consoleError('video generation error', e);
            } finally {
                consoleLog('end of handleGenerateClick');
                abortController.current = null;
            }
        };

        doGenerate();
    }, []);
    const handleEditScenario = useCallback(() => {
        navigate('/edit-scenario');
    }, []);
    const handleAbortVideoGeneration = () => {
        abortController.current?.abort();
        store.generatedVideo = undefined;
        setIsEncoding(false);
    };

    if (!store.scenario?.fragments) {
        return null;
    }

    const canGenerate = store.scenario.fragments.every(
        fragment =>
            fragment.type === UserFragmentType.PlainText
            || fragment.type === UserFragmentType.PlainImage && fragment.image !== undefined
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
            <FragmentsEditor
                disabled={isEncoding}
            />
            {isEncoding && (
                <ProgressCurtain>
                    <Button onClick={handleAbortVideoGeneration}>
                        Cancel
                    </Button>
                </ProgressCurtain>
            )}
        </>
    );
});
