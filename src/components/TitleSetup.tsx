import {useState} from 'react';
import {useNavigate} from 'react-router-dom';

import {useStore} from '../store';

export const TitleSetup = () => {
    const store = useStore();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');

    const handleSkip = () => {
        navigate('/edit-scenario');
    };

    const handleConfirm = () => {
        store.scenario!.title = title;
        navigate('/edit-scenario');
    };

    return (
        <div>
            <input value={title} onChange={e => setTitle(e.target.value)} />
            <button onClick={handleConfirm}>confirm</button>
            <button onClick={handleSkip}>skip</button>
        </div>
    );
};
