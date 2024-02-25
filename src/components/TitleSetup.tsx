import {useState} from 'react';
import {useNavigate} from 'react-router-dom';

import {useStore} from '../store';
import {consoleLog} from '../utils';

export const TitleSetup = () => {
    const store = useStore();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');

    const handleSkip = () => {
        navigate('/edit-scenario');
    };

    const handleConfirm = () => {
        if (!store.scenario) {
            return;
        }
        store.scenario.title = title;
        consoleLog('setting title', title);
        navigate('/edit-scenario');
    };

    return (
        <div>
            <textarea
                rows={5}
                cols={40}
                value={title} onChange={e => setTitle(e.target.value)}
            />
            <div>
                <button onClick={handleConfirm}>confirm</button>
                <button onClick={handleSkip}>skip</button>
            </div>
        </div>
    );
};