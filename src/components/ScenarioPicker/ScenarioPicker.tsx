import {useStore} from '../../store';
import {Wrapper} from './ScenarioPicker.styles';
import {Preset} from './Preset';

export const ScenarioPicker = () => {
    const store = useStore();
    const presets = store.presets;

    if (!presets) {
        return null;
    }

    return (
        <Wrapper>
            {presets.map(preset => (
                <Preset preset={preset} key={preset.id}/>
            ))}
        </Wrapper>
    );
};
