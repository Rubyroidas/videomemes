import {FC} from 'react';
import {useNavigate} from 'react-router-dom';
import shortUuid from 'short-uuid';

import {Format, ScenarioPreset, TextSize} from '../../types';
import {Button} from '../App.styles';
import {useStore} from '../../store';

export const Preset: FC<{preset: ScenarioPreset}> = ({preset}) => {
    const store = useStore();
    const navigate = useNavigate();
    const handleClick = () => {
        store.scenario = {
            format: Format.InstagramStory,
            phrases: preset.items.map(item => ({
                id: shortUuid().uuid(),
                collectionId: item.collectionId,
                phraseId: item.itemId,
                text: item.placeholder,
                textSize: TextSize.Normal,
                imageSize: 1,
            })),
        };
        navigate('/edit-phrases');
    };

    return (
        <div>
            <div>{preset.name}</div>
            <Button onClick={handleClick}>Choose</Button>
        </div>
    );
}
