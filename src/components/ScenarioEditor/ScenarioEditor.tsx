import {useCallback, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {observer} from 'mobx-react';
import shortUuid from 'short-uuid';

import {Button, ButtonSelector, FloatingButton, ListTitle} from '../App.styles';
import {Icon} from '../PhrasesEditor/PhraseEditor.styles';
import {EditListIcon} from '../../icons/EditListIcon';
import {ScenarioList} from './ScenarioList';
import {AddPhrase} from './AddPhrase';
import {Collection, CollectionItem, Format, TextSize, UserPhraseType} from '../../types';
import {useStore} from '../../store';
import {AddIcon} from '../../icons/AddIcon';
import {ArrowLeft} from '../../icons/ArrowLeft';

const formatSelectorValues: {
    value: Format,
    text: string,
}[] = [
    {
        value: Format.InstagramStory,
        text: 'Instagram story',
    },
    {
        value: Format.InstagramPost,
        text: 'Instagram post',
    },
    {
        value: Format.YoutubeVideo,
        text: 'Youtube video',
    },
];

export const ScenarioEditor = observer(() => {
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
            type: UserPhraseType.PlainText,
            collectionId: collection.id,
            phraseId: item.id,
            text: item.text,
            textSize: TextSize.Normal,
            imageSize: 1,
        });
        setIsAddingVisible(false);
    }, []);
    const handleChangeFormat = useCallback((format: Format) => {
        if (!store.scenario) {
            return;
        }
        store.scenario.format = format;
    }, []);

    if (!store.scenario?.phrases) {
        return null;
    }

    const scenarioTotalDuration = store.scenarioTotalDuration.toFixed(1);

    return (
        <div>
            {store.scenario.phrases.length > 0 && (
                <Button onClick={handleEditPhrases}>
                    <Icon>
                        <EditListIcon/>
                    </Icon>
                    Edit phrases
                </Button>
            )}
            <div>
                {isAddingVisible && (
                    <Button onClick={toggleAddClip}>
                        <ArrowLeft/>
                        Back to phrases list
                    </Button>
                )}
            </div>
            {isAddingVisible ? (
                <AddPhrase onSelect={handleAddItem}/>
            ) : (
                <>
                    <ButtonSelector
                        caption="Video format"
                        value={store.scenario.format}
                        values={formatSelectorValues}
                        onChange={handleChangeFormat}
                    />
                    <ListTitle>Scenario total duration: {scenarioTotalDuration}s</ListTitle>
                    <ScenarioList/>
                </>
            )}
            {!isAddingVisible && (
                <FloatingButton onClick={toggleAddClip}>
                    <AddIcon/>
                </FloatingButton>
            )}
        </div>
    )
});
