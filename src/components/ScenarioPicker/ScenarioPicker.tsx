import {useStore} from '../../store';
import {ScenarioPickerWrapper} from './ScenarioPicker.styles';
import {Preset} from './Preset';

export const ScenarioPicker = () => {
    const store = useStore();
    const presets = store.presets;

    if (!presets) {
        return null;
    }

    return (
        <ScenarioPickerWrapper>
            {presets.map((preset, index) => (
                <Preset preset={preset} key={preset.id} index={index + 1}/>
            ))}
        </ScenarioPickerWrapper>
    );
};
