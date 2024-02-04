import {useEffect} from 'react';
import {useNavigate, useSearchParams} from 'react-router-dom';

import shortUuid from 'short-uuid';
import {Format} from '../types';
import {useStore} from '../store';

export const NewScenarioPage = () => {
    const store = useStore();
    const navigate = useNavigate();
    const [params] = useSearchParams();
    const isFromPreset = params.get('from') === 'preset';

    useEffect(() => {
        store.scenario = {
            uuid: shortUuid().uuid(),
            format: Format.InstagramStory,
            phrases: [],
        };
        if (isFromPreset) {
            navigate('/pick-preset-scenario');
        } else {
            navigate('/edit-scenario');
        }
    }, []);

    return null;
}
