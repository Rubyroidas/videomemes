import {makeAutoObservable} from 'mobx';

import {Collection} from '../types';
import {FFmpeg} from '@ffmpeg/ffmpeg';

export class Store {
    collections: Collection[] | undefined;
    ffmpeg: FFmpeg | undefined;
    constructor() {
        makeAutoObservable(this);
    }
}
