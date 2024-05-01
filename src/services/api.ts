import axios from 'axios';

import {FeedItem, Format, UserFragment, UserScenario} from '../types';
import {consoleError, consoleLog, wait} from '../utils';

export type SerializedConfig = {
    uuid: string;
    format: Format,
    title?: string;
    fragments: UserFragment[];
    version: string;
}

export class Api {
    url: string;

    constructor() {
        this.url = 'https://api.memely.net';
    }

    async getRequest<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
        const url = new URL(`${this.url}${endpoint}`);
        for (const [key, value] of Object.entries(params)) {
            url.searchParams.set(key, value);
        }
        const res = await fetch(url);
        const json = await res.json();
        consoleLog(`API ${endpoint} RESPONSE`, json);
        if (json.status === false || json.data === undefined) {
            throw new Error('bad data');
        }
        return json.data as T;
    }

    async postRequest<T>(endpoint: string, params: Record<string, string> = {}, body: string | FormData): Promise<T> {
        const url = new URL(`${this.url}${endpoint}`);
        for (const [key, value] of Object.entries(params)) {
            url.searchParams.set(key, value);
        }

        if (body instanceof FormData) {
            const ares = await axios.postForm<T>(url.toString(), body);
            return ares.data;
        } else {
            const ares = await axios.post<T>(url.toString(), body, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            return ares.data;
        }
    }

    serializeScenario(scenario: UserScenario): SerializedConfig {
        const {uuid, format, title, fragments} = scenario;
        return {
            uuid,
            format,
            title,
            fragments,
            version: __VER__,
        };
    }

    async uploadScenarioAndFile(scenario: UserScenario, file: Blob) {
        const scenarioSerialized = JSON.stringify(this.serializeScenario(scenario));
        const formData = new FormData();
        formData.set('uuid', scenario.uuid);
        formData.set('video', file);
        formData.set('config', scenarioSerialized);
        const filePromise = this.postRequest('/upload/video', {}, formData);
        const timeoutPromise = wait(30000);

        try {
            await Promise.race([
                Promise.all([
                    filePromise,
                ]),
                timeoutPromise,
            ]);
        } catch (e) {
            consoleError('error during uploading config/file', e);
        }
    }

    async getFeed() {
        return this.getRequest<FeedItem[]>('/feed');
    }

    async getFeedItem(id: string) {
        return this.getRequest<FeedItem>(`/feed/${id}`);
    }
}
