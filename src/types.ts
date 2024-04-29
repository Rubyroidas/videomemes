export type Point = {
    x: number;
    y: number;
}
export type Size = {
    width: number;
    height: number;
}
export type Rect = Point & Size;
export type CollectionItem = {
    id: number;
    text: string;
    snapshot: string;
    duration: number;
    preview: string;
    templates: Record<Format, string>;
}
export type Collection = {
    id: string;
    cover: string;
    name: string;
    textArea: Record<Format, Rect>;
    watermarkArea: Record<Format, Rect>;
    playButton: Record<Format, Point>;
    items: CollectionItem[];
}
export type ScenarioPresetItem = {
    collectionId: string;
    itemId: number;
    placeholder: string;
}
export type ScenarioPreset = {
    id: string;
    name: string;
    items: ScenarioPresetItem[];
}

export type GlobalContentConfig = {
    collections: Collection[];
    scenarioTemplates: ScenarioPreset[];
}

export enum UserPhraseType {
    PlainText = 'plainText',
    PlainImage = 'plainImage',
}

export enum Format {
    InstagramStory = 'ig_story',
    InstagramPost = 'ig_post',
    YoutubeVideo = 'yt_video',
}

export type UserScenario = {
    uuid: string;
    format: Format;
    title?: string;
    fragments: UserPhrase[];
}

export type UserPhrase = {
    id: string;
    type: UserPhraseType;
    collectionId: string;
    fragmentId: number;
    text: string;
    textSize: number;
    imageSize: number;
    image?: HTMLCanvasElement;
}

export type FeedItem = {
    id: number;
    url: string;
    snapshot: string;
    format: Format;
    created_at: string;
    duration: number;
    config: UserScenario;
}
