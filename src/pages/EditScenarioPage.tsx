import {useEffect} from 'react';
import {observer} from 'mobx-react';

import {AppTitle, BasicLink} from '../components/App.styles';
import {ScenarioEditor} from '../components/ScenarioEditor/ScenarioEditor';
import {Format} from '../types';
import {useStore} from '../store';

export const EditScenarioPage = observer(() => {
    const store = useStore();
    useEffect(() => {
        if (!store.scenario) {
            store.scenario = {
                format: Format.InstagramStory,
                phrases: [],
            };
        }
    }, []);

    if (!store.scenario) {
        return null;
    }

    return (
        <div>
            <BasicLink to="/">go home</BasicLink>
            <AppTitle>Edit scenario</AppTitle>
            <ScenarioEditor/>
        </div>
    );
});
