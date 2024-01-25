import {useCallback, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import shortUuid from 'short-uuid';

import {Button} from '../App.styles';
import {Icon} from '../PhrasesEditor/PhraseEditor.styles';
import {EditListIcon} from '../../icons/EditListIcon';
import {ScenarioList} from './ScenarioList';
import {AddPhrase} from './AddPhrase';
import {Collection, CollectionItem, TextSize} from '../../types';
import {useStore} from '../../store';

export const ScenarioEditor = () => {
    const navigate = useNavigate();
    const store = useStore();
    const [isAddingVisible, setIsAddingVisible] = useState(false);
    const toggleAddClip = useCallback(() => {
        setIsAddingVisible(v => !v);
    }, []);
    const handleEditPhrases = useCallback(() => {
        navigate('/edit-phrases')
    }, []);
    const handleAddItem = useCallback((collection: Collection, item: CollectionItem) => {
        if (!store.scenario) {
            return;
        }
        store.scenario.phrases.push({
            id: shortUuid().uuid(),
            collectionId: collection.id,
            phraseId: item.id,
            text: item.text,
            textSize: TextSize.Normal,
            imageSize: 1,
        });
        setIsAddingVisible(false);
    }, []);

    return (
        <div>
            <Button onClick={handleEditPhrases}>
                <Icon>
                    <EditListIcon/>
                </Icon>
                Edit phrases
            </Button>
            {isAddingVisible ? (
                <AddPhrase onSelect={handleAddItem}/>
            ) : (
                <ScenarioList/>
            )}
            <Button onClick={toggleAddClip}>
                {isAddingVisible ? 'Back to phrases list' : 'Add clip'}
            </Button>
        </div>
    )
};
