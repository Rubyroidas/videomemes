import {useNavigate} from 'react-router-dom';

import {Button} from '../App.styles';
import {Icon} from '../PhraseEditor.styles';
import {EditListIcon} from '../../icons/EditListIcon';
import {ScenarioList} from './ScenarioList';

export const ScenarioEditor = () => {
    const navigate = useNavigate();
    const handleAddClip = () => {
    };
    const handleEditPhrases = () => {
        navigate('/edit-phrases')
    };

    return (
        <div>
            <Button onClick={handleEditPhrases}>
                <Icon>
                    <EditListIcon/>
                </Icon>
                Edit phrases
            </Button>
            <ScenarioList/>
            <Button onClick={handleAddClip}>
                Add clip
            </Button>
        </div>
    )
};
