import {useEffect} from 'react';
import {useNavigate, useSearchParams} from 'react-router-dom';

import shortUuid from 'short-uuid';
import {Format} from '../types';
import {useStore} from '../store';
import {PREDEFINED_BACKGROUND_COLORS, PREDEFINED_TEXT_COLORS, VIDEO_TITLE_ENABLED} from '../config';

export const NewScenarioPage = () => {
    const store = useStore();
    const navigate = useNavigate();
    const [params] = useSearchParams();
    const isFromPreset = params.get('from') === 'preset';

    useEffect(() => {
        store.scenario = {
            uuid: shortUuid().uuid(),
            format: Format.InstagramStory,
            textColor: PREDEFINED_TEXT_COLORS[0],
            backgroundColor: PREDEFINED_BACKGROUND_COLORS[0],
            fragments: [],
        };
        if (isFromPreset) {
            navigate('/pick-preset-scenario');
        } else {
            navigate(VIDEO_TITLE_ENABLED ? '/title-setup' : '/edit-scenario');
        }
    }, []);

    return null;
}
