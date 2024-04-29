import {configure, makeAutoObservable} from 'mobx';

configure({
    enforceActions: 'never',
});

import {Collection, ScenarioPreset, UserScenario} from '../types';
import {FFmpeg} from '@ffmpeg/ffmpeg';

export class Store {
    collections: Collection[] | undefined;
    presets: ScenarioPreset[] | undefined;
    scenario: UserScenario | undefined;
    generatedVideo: Blob | undefined;
    lastUsedCollectionId: string | undefined;

    ffmpeg: FFmpeg | undefined;

    constructor() {
        makeAutoObservable(this);
    }

    get scenarioTotalDuration() {
        const items = this.scenario?.fragments ?? [];
        const collections = this.collections ?? [];

        return items.reduce((acc, item) => {
            const collection = collections.find(c => c.id === item.collectionId);
            const colItem = collection?.items.find(i => i.id === item.fragmentId);
            const duration = colItem?.duration ?? 0;
            return acc + duration;
        }, 0);
    }

    getCollection(id: string) {
        return this.collections?.find(collection => collection.id === id);
    }

    getCollectionItem(collectionId: string, itemId: number) {
        return this.getCollection(collectionId)?.items?.find(item => item.id === itemId);
    }

    getCollectionAndItem(collectionId: string, itemId: number) {
        const collection = this.getCollection(collectionId);
        const item = collection?.items?.find(item => item.id === itemId);

        return {
            collection,
            item,
        };
    }
}
