export type Rect = {
    x: number;
    y: number;
    width: number;
    height: number;
}
export type CollectionItem = {
    id: number;
    videoFile: string;
    name: string;
    duration: number;
}
export type Collection = {
    id: string;
    name: string;
    textArea: Rect;
    watermarkArea: Rect;
    items: CollectionItem[];
}

export type UserPhrase = {
    collectionId: string;
    phraseId: number;
    text?: string;
    image?: Blob;
}
