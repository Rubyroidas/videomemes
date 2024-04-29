import {useCallback, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {observer} from 'mobx-react';
import shortUuid from 'short-uuid';

import {Button, FloatingButton, ListDescription, ListTitle} from '../App.styles';
import {Icon} from '../FragmentsEditor/FragmentEditor.styles';
import {EditListIcon} from '../../icons/EditListIcon';
import {ScenarioList} from './ScenarioList';
import {AddFragment} from './AddFragment';
import {Collection, CollectionItem, Format, UserFragmentType} from '../../types';
import {useStore} from '../../store';
import {AddIcon} from '../../icons/AddIcon';
import {ArrowLeft} from '../../icons/ArrowLeft';
import {ButtonSelector} from '../ButtonSelector';
import {FingerDragIcon} from '../../icons/FingerDragIcon';

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
    const handleEditFragments = useCallback(() => {
        navigate('/edit-fragments');
    }, []);
    const handleAddItem = useCallback((collection: Collection, item: CollectionItem) => {
        if (!store.scenario) {
            return;
        }
        store.scenario.fragments.push({
            id: shortUuid().uuid(),
            type: UserFragmentType.PlainText,
            collectionId: collection.id,
            fragmentId: item.id,
            text: item.text,
            textSize: 1,
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

    if (!store.scenario?.fragments) {
        return null;
    }

    const scenarioTotalDuration = store.scenarioTotalDuration.toFixed(1);

    return (
        <div>
            {store.scenario.fragments.length > 0 && (
                <Button onClick={handleEditFragments}>
                    <Icon>
                        <EditListIcon/>
                    </Icon>
                    Edit fragments
                </Button>
            )}
            <div>
                {isAddingVisible && (
                    <Button onClick={toggleAddClip}>
                        <ArrowLeft/>
                        Back to fragments list
                    </Button>
                )}
            </div>
            {isAddingVisible ? (
                <AddFragment onSelect={handleAddItem}/>
            ) : (
                <>
                    <ButtonSelector
                        caption="Video format"
                        value={store.scenario.format}
                        values={formatSelectorValues}
                        onChange={handleChangeFormat}
                    />
                    <ListTitle>Scenario total duration: {scenarioTotalDuration}s (max 60s)</ListTitle>
                    <ListDescription>
                        Swap the fragments to change the order
                        <FingerDragIcon/>
                    </ListDescription>
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
