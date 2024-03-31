import axios from 'axios';

import {FeedItem, UserScenario} from '../types';
import {consoleError, wait} from '../utils';

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
        return (json.data !== undefined ? json.data : json) as T;
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

    async uploadScenarioAndFile(scenario: UserScenario, file: Blob) {
        const scenarioSerialized = JSON.stringify(scenario);
        const configPromise = this.postRequest('/upload/config', {}, scenarioSerialized);
        const formData = new FormData();
        formData.set('uuid', scenario.uuid);
        formData.set('video', file);
        formData.set('config', scenarioSerialized);
        const filePromise = this.postRequest('/upload/video', {}, formData);
        const timeoutPromise = wait(30000);

        try {
            await Promise.race([
                Promise.all([
                    configPromise,
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

    async getFeedItem(id: number) {
        return this.getRequest<FeedItem>(`/feed/${id}`);
    }
}
