import {useEffect} from 'react';
import {Link, useNavigate, useParams} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import shortUuid from 'short-uuid';

import {useStore} from '../store';
import {ScenarioItem} from '../components/ScenarioEditor/ScenarioItem';
import {Format, UserFragmentType} from '../types';
import {HomeIcon} from '../icons/HomeIcon';
import {LanguageSelector} from '../components/LanguageSelector';
import {AppTitle, Button, ListTitle} from '../components/App.styles';
import {AnalyticsEvent, sendAnalyticsEvent} from '../services/analytics';
import {VIDEO_TITLE_ENABLED} from '../config';

export const TemplatePage = () => {
    const {t} = useTranslation();
    const params = useParams();
    const navigate = useNavigate();
    const store = useStore();

    const preset = store.presets?.find(preset => preset.id === params.id);
    useEffect(() => {
        if (!preset) {
            navigate('/');
        }
    }, [preset]);

    const handleUseTemplate = () => {
        if (!preset) {
            return;
        }
        sendAnalyticsEvent(AnalyticsEvent.Preset_Selected, {
            preset_id: preset.id,
            source: 'template-page',
        });
        store.scenario = {
            uuid: shortUuid().uuid(),
            format: Format.InstagramStory,
            fragments: preset.items.map(item => ({
                id: shortUuid().uuid(),
                type: UserFragmentType.PlainText,
                collectionId: item.collectionId,
                fragmentId: item.itemId,
                text: item.placeholder,
                textSize: 1,
                imageSize: 1,
            })),
        };
        navigate(VIDEO_TITLE_ENABLED ? '/title-setup' : '/edit-scenario');
    };

    if (!preset) {
        return null;
    }

    return (
        <div>
            <AppTitle>
                <Link to="/">
                    <HomeIcon/>
                </Link>
                {t('templatePage.title')}
                <LanguageSelector/>
            </AppTitle>
            <ListTitle>{t('templatePage.listTitle')}</ListTitle>
            <Button onClick={handleUseTemplate}>
                {t('templatePage.useTemplateButton')}
            </Button>
            <div>
                {preset.items.map((item, index) => (
                    <ScenarioItem
                        isDragging={false}
                        index={index + 1}
                        fragment={{
                            id: shortUuid().uuid(),
                            type: UserFragmentType.PlainText,
                            collectionId: item.collectionId,
                            fragmentId: item.itemId,
                            text: item.placeholder,
                            textSize: 1,
                            imageSize: 1,
                        }}
                        disabled={false}
                        onDelete={() => {}}
                    />
                ))}
            </div>
        </div>
    );
};
