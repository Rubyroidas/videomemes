import {useNavigate} from 'react-router-dom';
import shortUuid from 'short-uuid';

import {ScenarioPreset, UserFragmentType} from '../../types';
import {useStore} from '../../store';
import {PresetSnapshotImage, PresetWrapper} from './ScenarioPicker.styles';
import {VIDEO_TITLE_ENABLED} from '../../config';
import {
    ScenarioItemClipTitle,
    ScenarioItemDuration,
    ScenarioItemIndexNumber,
    ScenarioItemUserText,
    ScenarioItemWrapper,
    ScenarioItemWrapperGrid
} from '../ScenarioEditor/ScenarioEditor.styles';
import {AnalyticsEvent, sendAnalyticsEvent} from '../../services/analytics';

type Props = {
    preset: ScenarioPreset;
    index: number;
}

export const Preset = ({preset, index}: Props) => {
    const store = useStore();
    const navigate = useNavigate();
    const handleClick = () => {
        sendAnalyticsEvent(AnalyticsEvent.Preset_Selected, {
            preset_id: preset.id,
            source: 'template-list-page',
        });
        store.scenario!.fragments = preset.items.map(item => ({
            id: shortUuid().uuid(),
            type: UserFragmentType.PlainText,
            collectionId: item.collectionId,
            fragmentId: item.itemId,
            text: item.placeholder,
            textSize: 1,
            imageSize: 1,
        }));
        navigate(VIDEO_TITLE_ENABLED ? '/title-setup' : '/edit-scenario');
    };
    const items = preset.items
        .map(presetItem => store.getCollectionAndItem(presetItem.collectionId, presetItem.itemId));

    const imageUrl = items[0].item?.snapshot;
    if (!imageUrl) {
        return null;
    }
    const totalDuration = items.reduce((curr, item) => curr + (item?.item?.duration ?? 0), 0);

    return (
        <PresetWrapper
            onClick={handleClick}
            className="preloading"
        >
            <ScenarioItemWrapper>
                <PresetSnapshotImage
                    loading="lazy"
                    src={imageUrl}
                    crossOrigin="anonymous"
                />

                <ScenarioItemWrapperGrid>
                    <ScenarioItemIndexNumber>
                        #{index}
                    </ScenarioItemIndexNumber>
                    <ScenarioItemUserText>
                        {preset.items.length} videos
                    </ScenarioItemUserText>
                    <ScenarioItemClipTitle>
                        {preset.name}
                    </ScenarioItemClipTitle>
                    <ScenarioItemDuration>
                        {totalDuration.toFixed(1)}s
                    </ScenarioItemDuration>
                </ScenarioItemWrapperGrid>
            </ScenarioItemWrapper>
        </PresetWrapper>
    );
}
