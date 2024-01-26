import {useCallback, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import shortUuid from 'short-uuid';

import {Button, ButtonSelector} from '../App.styles';
import {Icon} from '../PhrasesEditor/PhraseEditor.styles';
import {EditListIcon} from '../../icons/EditListIcon';
import {ScenarioList} from './ScenarioList';
import {AddPhrase} from './AddPhrase';
import {Collection, CollectionItem, Format, TextSize} from '../../types';
import {useStore} from '../../store';
import {observer} from 'mobx-react';

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
                    <ScenarioList/>
                </>
            )}
            <Button onClick={toggleAddClip}>
                {isAddingVisible ? 'Back to phrases list' : 'Add clip'}
            </Button>
        </div>
    )
});
