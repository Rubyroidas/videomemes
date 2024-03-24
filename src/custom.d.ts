declare module '\*.png?raw-hex' {
    const content: string;
    export default content;
}
declare module '\*.mp3?raw-hex' {
    const content: string;
    export default content;
}

declare const __DEV__: boolean;

declare global {
    interface Window {
        VIDEO_UPLOAD_CONTENT_TYPE: string | undefined;
    }
}
