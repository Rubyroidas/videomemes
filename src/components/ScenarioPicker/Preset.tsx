import {FC} from 'react';
import {useNavigate} from 'react-router-dom';
import shortUuid from 'short-uuid';

import {ScenarioPreset, TextSize, UserPhraseType} from '../../types';
import {useStore} from '../../store';
import {PresetWrapper} from './ScenarioPicker.styles';
import {VIDEO_TITLE_ENABLED} from '../../config';

export const Preset: FC<{ preset: ScenarioPreset }> = ({preset}) => {
    const store = useStore();
    const navigate = useNavigate();
    const handleClick = () => {
        store.scenario!.phrases = preset.items.map(item => ({
            id: shortUuid().uuid(),
            type: UserPhraseType.PlainText,
            collectionId: item.collectionId,
            phraseId: item.itemId,
            text: item.placeholder,
            textSize: TextSize.Normal,
            imageSize: 1,
        }));
        navigate(VIDEO_TITLE_ENABLED ? '/title-setup' : '/edit-scenario');
    };

    return (
        <PresetWrapper onClick={handleClick}>
            {preset.name}
        </PresetWrapper>
    );
}
