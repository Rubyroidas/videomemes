import {FFmpeg} from '@ffmpeg/ffmpeg';
import {toBlobURL} from '@ffmpeg/util';

import {Collection, Point, Rect, ScenarioPreset} from './types';

export interface VideoProperties {
    fps: number;
}

export interface ProgressEvent {
    progress: number;
    time: number;
}

export const ffmpegExec = async (ffmpeg: FFmpeg, args: string[], progressCallback?: (e: ProgressEvent) => void) => {
    const logs: Record<string, string[]> = {};

    ffmpeg.on('log', ({message, type}) => {
        if (!logs[type]) {
            logs[type] = [];
        }
        logs[type].push(message);
    });
    if (progressCallback) {
        ffmpeg.on('progress', progressCallback);
    }
    await ffmpeg.exec(args);
    if (progressCallback) {
        ffmpeg.off('progress', progressCallback);
    }
    return Object.fromEntries(
        Object.entries(logs)
            .map(([k, v]) => [k, v.join('\n')])
    );
};

export const getVideoProperties = async (ffmpeg: FFmpeg, fileName: string): Promise<VideoProperties> => {
    const result: VideoProperties = {
        fps: 0,
    };
    const infoResult = await ffmpegExec(ffmpeg, ['-i', fileName]);
    const match = /(\d+)\sfps/i.exec(infoResult.stderr);
    if (match?.[1]) {
        result.fps = parseInt(match[1], 10);
    }
    return result;
};

export const ffmpegListFiles = async (ffmpeg: FFmpeg, path: string)=>
    (await ffmpeg.listDir(path)).filter(p => !(['.', '..'].includes(p.name) && p.isDir));

export const debugCanvas = (canvas: HTMLCanvasElement) => {
    const {width, height} = canvas;
    const img = canvas.toDataURL('image/png');
    console.log(img);
    console.log('%c ', `color: transparent;font-size:1px;width:${width}px;height:${height}px;background:transparent url('${img}') no-repeat 0 0;background-zie: ${width}px ${height}px;`);
};

const _escape = document.createElement('textarea');

export const escapeHTML = (html: string) => {
    _escape.textContent = html;
    return _escape.innerHTML;
};

export const unescapeHTML = (html: string) => {
    _escape.innerHTML = html;
    return _escape.textContent;
};

export const drawLine = (ctx: CanvasRenderingContext2D, color: string, point1: Point, point2: Point) => {
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(point1.x, point1.y);
    ctx.lineTo(point2.x, point2.y);
    ctx.stroke();
};
export const drawRect = (ctx: CanvasRenderingContext2D, color: string, rect: Rect) => {
    ctx.strokeStyle = color;
    ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
};

export const html2text = (html: string) => {
    const c = document.createElement('div');
    c.innerHTML = html;

    const els = c.firstChild?.constructor === Text
        ? [c.firstChild, ...c.children]
        : [...c.children];

    return els.map(el => el.textContent).join('\n');
};

const pkgVersion = '0.12.6';
const pkgName = 'core';
// const baseURL = `https://unpkg.com/@ffmpeg/${pkgName}@${pkgVersion}/dist/esm`;
const ffmpegUrlPrefix = __DEV__
    ? ''
    : `https://cdn.memely.net/ffmpeg`;
const baseURL = `${ffmpegUrlPrefix}/ffmpeg-${pkgName}/${pkgVersion}`;
export const loadFFmpeg = async (ffmpeg: FFmpeg) => {
    try {
        console.log('ffmpeg: start loading...');
        await ffmpeg.load({
            coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
            wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
            // workerURL: await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`, 'text/javascript')
        });
        console.log('ffmpeg: loaded');
    } catch (e) {
        console.error('ffmpeg: not loaded', e);
    }
}

export function* reduceWideLines(getTextWidth: (text: string) => number, text: string, maxWidth: number): Generator<string> {
    for (const line of text.split('\n')) {
        const lineWidth = getTextWidth(line);
        if (lineWidth > maxWidth) {
            let parts = [line, ''];
            let m;
            do {
                m = parts[0].match(/^(.+)(\s+?)(\S+?)$/);
                if (m) {
                    const partWidth = getTextWidth(m[1]);
                    if (partWidth <= maxWidth) {
                        yield m[1];
                        parts = [`${m[3]}${parts[1]}`, ''];
                        if (getTextWidth(parts[0]) <= maxWidth) {
                            break;
                        }
                    } else {
                        parts = [m[1], `${m[2]}${m[3]}${parts[1]}`];
                    }
                }
            } while (m);
            yield parts[0];
        } else {
            yield line;
        }
    }
}

export const hexToUint8Array = (hex: string) => {
    const len = hex.length / 2;
    const arr = new Uint8Array(len);

    for (let i = 0; i < len; i++) {
        const h = hex.substring(i * 2, (i + 1) * 2);
        arr[i] = parseInt(h, 16);
    }

    return arr;
};

const loadJSON = async <T>(url: string): Promise<T> => {
    const res = await fetch(url);
    return await res.json() as T;
};

export const loadCollections = async () => {
    // const url = await fetch('tinkoff-vertical.json');
    const url = `https://cdn.memely.net/templates/tinkoff/items.json?q=${Date.now()}`;
    return [await loadJSON<Collection>(url)];
};

export const loadScenarioPresets = async () => {
    const url = `https://cdn.memely.net/templates/tinkoff/scenarios.json?q=${Date.now()}`;
    return await loadJSON<ScenarioPreset[]>(url);
};

export const imageLoadPromise = async (img: HTMLImageElement): Promise<void> => new Promise(resolve => {
    img.addEventListener('load', () => resolve());
});
