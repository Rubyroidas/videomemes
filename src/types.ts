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
    videoFile: string;
    name: string;
    duration: number;
}
export type Collection = {
    id: string;
    name: string;
    size: Size;
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
