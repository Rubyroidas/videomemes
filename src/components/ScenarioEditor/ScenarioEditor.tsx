import {useNavigate} from 'react-router-dom';
import {observer} from 'mobx-react';

import {useStore} from '../../store';
import {ScenarioItem} from './ScenarioItem';
import {Button} from '../App.styles';
import {Icon} from '../PhraseEditor.styles';
import {EditListIcon} from '../../icons/EditListIcon';

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
            <Button onClick={handleEditPhrases}>
                <Icon>
                    <EditListIcon/>
                </Icon>
                Edit phrases
            </Button>
            {phrases.map((phrase, index) => (
                <ScenarioItem
                    index={index + 1}
                    phrase={phrase}
                    disabled={false}
                    canMoveUp={index > 0}
                    canMoveDown={index < phrases.length - 1}
                    onDelete={() => handleDelete(index)}
                    onMoveUp={() => handleMoveUp(index)}
                    onMoveDown={() => handleMoveDown(index)}
                    key={index}/>
            ))}
            <button onClick={handleAddClip}>Add clip</button>
        </div>
    )
});
