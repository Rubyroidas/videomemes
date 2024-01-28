import {makeAutoObservable} from 'mobx';

import {Collection, ScenarioPreset, UserScenario} from '../types';
import {FFmpeg} from '@ffmpeg/ffmpeg';

export class Store {
    collections: Collection[] | undefined;
    presets: ScenarioPreset[] | undefined;
    scenario: UserScenario | undefined;
    generatedVideo: Blob | undefined;

    ffmpeg: FFmpeg | undefined;

    constructor() {
        makeAutoObservable(this);
    }

    get scenarioTotalDuration() {
        const items = this.scenario?.phrases ?? [];
        const collections = this.collections ?? [];

        return items.reduce((acc, item) => {
            const collection = collections.find(c => c.id === item.collectionId);
            const colItem = collection?.items.find(i => i.id === item.phraseId);
            const duration = colItem?.duration ?? 0;
            return acc + duration;
        }, 0);
    }
}
