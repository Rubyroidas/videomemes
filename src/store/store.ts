import {makeAutoObservable} from 'mobx';

import {Collection, ScenarioPreset, UserScenario} from '../types';
import {FFmpeg} from '@ffmpeg/ffmpeg';

export class Store {
    collections: Collection[] | undefined;
    presets: ScenarioPreset[] | undefined;
    scenario: UserScenario | undefined;
    //     = {
    //     format: Format.InstagramStory,
    //     phrases: [
    //         {
    //             collectionId: 'tinkoff',
    //             phraseId: 1,
    //             text: 'You decide to search for the\nnew job',
    //             textSize: TextSize.Normal,
    //             imageSize: 1,
    //         },
    //         {
    //             collectionId: 'tinkoff',
    //             phraseId: 2,
    //             text: 'hello world 2',
    //             textSize: TextSize.Normal,
    //             imageSize: 1,
    //         },
    //         {
    //             collectionId: 'tinkoff',
    //             phraseId: 3,
    //             text: 'hello world 3',
    //             textSize: TextSize.Normal,
    //             imageSize: 1,
    //         },
    //     ]
    // };

    ffmpeg: FFmpeg | undefined;

    constructor() {
        makeAutoObservable(this);
    }
}
