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

export enum TextSize {
    Small = 'small',
    Normal = 'normal',
    Big = 'big',
}

export enum ImageSize {
    Small = 'small',
    Normal = 'normal',
    Big = 'big',
}

export type UserPhrase = {
    collectionId: string;
    phraseId: number;
    text?: string;
    textSize: TextSize;
    imageSize: ImageSize;
    image?: Blob;
}
