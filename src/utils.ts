import {FFmpeg} from '@ffmpeg/ffmpeg';
import {Point, Rect} from "./types.ts";

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
