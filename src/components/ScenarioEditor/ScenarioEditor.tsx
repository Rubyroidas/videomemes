import {useNavigate} from 'react-router-dom';
import {observer} from 'mobx-react';

import {useStore} from '../../store';
import {ScenarioItem} from './ScenarioItem';

export const ScenarioEditor = observer(() => {
    const store = useStore();
    const navigate = useNavigate();

    const handleAddClip = () => {
    };
    const handleEditPhrases = () => {
        navigate('/edit-phrases')
    };

    if (!store.scenario || !store.collections) {
        return null;
    }

    const phrases = store.scenario.phrases;

    const handleDelete = (index: number) => {
        console.log('delete', index);
        store.scenario!.phrases = [
            ...store.scenario!.phrases.slice(0, index),
            ...store.scenario!.phrases.slice(index + 1),
        ];
    };
    const handleMoveUp = (index: number) => {
        console.log('move up', index);
        const upper = store.scenario!.phrases[index - 1];
        const current = store.scenario!.phrases[index];
        store.scenario!.phrases = [
            ...store.scenario!.phrases.slice(0, index - 1),
            current,
            upper,
            ...store.scenario!.phrases.slice(index + 1),
        ];
    };
    const handleMoveDown = (index: number) => {
        console.log('move down', index);
        const current = store.scenario!.phrases[index];
        const downer = store.scenario!.phrases[index + 1];
        store.scenario!.phrases = [
            ...store.scenario!.phrases.slice(0, index),
            downer,
            current,
            ...store.scenario!.phrases.slice(index + 2),
        ];
    };

    return (
        <div>
            <button onClick={handleEditPhrases}>Edit phrases</button>
            {phrases.map((phrase, index) => (
                <div>
                    #{index + 1}.
                    <ScenarioItem
                        phrase={phrase}
                        disabled={false}
                        canMoveUp={index > 0}
                        canMoveDown={index < phrases.length - 1}
                        onDelete={() => handleDelete(index)}
                        onMoveUp={() => handleMoveUp(index)}
                        onMoveDown={() => handleMoveDown(index)}
                        key={index}/>
                </div>
            ))}
            <button onClick={handleAddClip}>Add clip</button>
        </div>
    )
});
