import {useStore} from '../../store';

import {ScenarioItem} from './ScenarioItem';

export const ScenarioEditor = () => {
    const store = useStore();

    const handleAddClip = () => {
    };

    if (!store.scenario || !store.collections) {
        return null;
    }

    const phrases = store.scenario.phrases;

    return (
        <div>
            {phrases.map((phrase, index) => (
                <div>
                    #{index + 1}.
                    <ScenarioItem
                        phrase={phrase}
                        key={index}/>
                </div>
            ))}
            <button onClick={handleAddClip}>Add clip</button>
        </div>
    )
};
