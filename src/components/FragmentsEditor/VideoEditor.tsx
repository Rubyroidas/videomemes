import {FC, useCallback, useRef, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {observer} from 'mobx-react';
import {useTranslation} from 'react-i18next';

import {Button} from '../App.styles';
import {FragmentsEditor} from './FragmentsEditor';
import {generateVideo} from '../../generate';
import {Icon, ButtonsToolbar} from './FragmentEditor.styles';
import {PlayIcon} from '../../icons/PlayIcon';
import {EditListIcon} from '../../icons/EditListIcon';
import {useStore} from '../../store';
import {ProgressCurtain} from './ProgressCurtain';
import {useApi} from '../../services/apiContext';
import {UserFragmentType} from '../../types';
import {consoleError, consoleLog} from '../../utils';
import {ConsentDialog} from './ConsentDialog';
import {AnalyticsEvent, sendAnalyticsEvent} from '../../services/analytics';
import {SliderCheckboxWithLabel} from '../SliderCheckbox';

export const VideoEditor: FC = observer(() => {
    const {t} = useTranslation();
    const store = useStore();
    const api = useApi();
    const navigate = useNavigate();

    const [isEncoding, setIsEncoding] = useState(false);
    const [isFullQuality, setIsFullQuality] = useState(false);
    const [isConsentDialogVisible, setIsConsentDialogVisible] = useState(false);
    const abortController = useRef<AbortController | null>(null);

    const doGenerate =  async () => {
        if (isEncoding || !store.scenario || !store.collections) {
            return;
        }

        sendAnalyticsEvent(AnalyticsEvent.GenerateVideo_Started, {
            duration: store.scenarioTotalDuration,
        });
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
                {fullQuality: isFullQuality},
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
            if (abortController.current?.signal.aborted) {
                sendAnalyticsEvent(AnalyticsEvent.GenerateVideo_UserAborted, {
                    duration: store.scenarioTotalDuration,
                });
            } else {
                sendAnalyticsEvent(AnalyticsEvent.GenerateVideo_Finished, {
                    duration: store.scenarioTotalDuration,
                });
            }
            abortController.current = null;
        }
    };
    const handleEditScenario = useCallback(() => {
        navigate('/edit-scenario');
    }, []);
    const handleAbortVideoGeneration = () => {
        abortController.current?.abort();
        store.generatedVideo = undefined;
        setIsEncoding(false);
    };
    const handleGenerateClick = () => {
        sendAnalyticsEvent(AnalyticsEvent.GenerateVideo_ConsentDialog_Shown);
        setIsConsentDialogVisible(true);
    };
    const handleConsentResult = (result: boolean) => {
        setIsConsentDialogVisible(false);
        sendAnalyticsEvent(AnalyticsEvent.GenerateVideo_ConsentDialog_Result, {
            result: result ? 'accepted' : 'rejected',
        });
        if (result) {
            doGenerate();
        }
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
            <ButtonsToolbar>
                <Button onClick={handleEditScenario}>
                    <Icon>
                        <EditListIcon/>
                    </Icon>
                    {t('editFragments.backToScenario')}
                </Button>
                {!isEncoding && (
                    <Button onClick={handleGenerateClick} disabled={!canGenerate}>
                        <Icon>
                            <PlayIcon/>
                        </Icon>
                        {t('editFragments.generateButton')}
                    </Button>
                )}
                <SliderCheckboxWithLabel
                    defaultChecked={isFullQuality}
                    onClick={() => setIsFullQuality(v => !v)}
                    label={t('editFragments.fullQuality')}
                />
            </ButtonsToolbar>
            <FragmentsEditor
                disabled={isEncoding}
            />
            {isEncoding && (
                <ProgressCurtain>
                    <Button onClick={handleAbortVideoGeneration}>
                        {t('editFragments.cancelGenerateButton')}
                    </Button>
                </ProgressCurtain>
            )}
            {isConsentDialogVisible && (
                <ConsentDialog
                    title={t('editFragments.generateConsentDialog.title')}
                    message={t('editFragments.generateConsentDialog.description')}
                    onClose={handleConsentResult}
                />
            )}
        </>
    );
});
