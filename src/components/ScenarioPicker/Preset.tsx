import {FC} from 'react';
import {useNavigate} from 'react-router-dom';

import {Format, ScenarioPreset, TextSize} from '../../types';
import {Button} from '../App.styles';
import {useStore} from '../../store';

export const Preset: FC<{preset: ScenarioPreset}> = ({preset}) => {
    console.log('preset', preset.id);
    const store = useStore();
    const navigate = useNavigate();
    const handleClick = () => {
        console.log(preset.id);
        store.scenario = {
            format: Format.InstagramStory,
            phrases: preset.items.map(item => ({
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
