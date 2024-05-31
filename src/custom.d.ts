declare module '\*.png?raw-hex' {
    const content: string;
    export default content;
}
declare module '\*.mp3?raw-hex' {
    const content: string;
    export default content;
}
declare module '\*.yaml' {
    const content: object;
    export default content;
}

declare const __DEV__: boolean;
declare const __VER__: string;
