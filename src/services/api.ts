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
        const contentTypeFormData = ((window as any).VIDEO_UPLOAD_CONTENT_TYPE ?? 'application/form-data') as string;
        const res = await fetch(url, {
            method: 'POST',
            body,
            headers: {
                'Content-Type': typeof body === 'string'
                    ? 'application/json'
                    : contentTypeFormData
            }
        });
        const json = await res.json();
        return (json.data !== undefined ? json.data : json) as T;
    }

    async uploadScenarioAndFile(scenario: UserScenario, file: Blob) {
        const configPromise = this.postRequest('/upload/config', {}, JSON.stringify(scenario));
        const formData = new FormData();
        formData.set('uuid', scenario.uuid);
        formData.set('video', file);
        const filePromise = this.postRequest('/upload/video', {}, formData);
        const timeoutPromise = wait(30000);

        try {
            await Promise.all([
                configPromise,
                filePromise,
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
