import {FFmpeg} from '@ffmpeg/ffmpeg';
import {fetchFile} from '@ffmpeg/util';

import {Collection, UserPhrase} from './types';

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

const TEXT_COLOR = '#ff0000';
const TEXT_FONT = 'bold 24px sans-serif';

const listFiles = async (ffmpeg: FFmpeg, path: string)=>
    (await ffmpeg.listDir(path)).filter(p => !(['.', '..'].includes(p.name) && p.isDir));

const renderTextSlide = async (width: number, height: number, text: string) => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = TEXT_COLOR;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.font = TEXT_FONT;
    ctx.fillText(text, width / 2, height / 2);

    const img = document.createElement('img');
    img.src = canvas.toDataURL('image/png');
    img.style.border = 'solid 1px red';

    return await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(blob => {
            if (blob) {
                resolve(blob);
            } else {
                reject();
            }
        }, 'image/png');
    });
};

export const generateVideo = async (
    ffmpeg: FFmpeg,
    userPhrases: UserPhrase[],
    collections: Collection[],
    setDecodingProgress: (progress: number) => void,
    setDecodingStatus: (status: string) => void
): Promise<Blob> => {
    const updateDecodingStatus = ({progress}: ProgressEvent) => {
        setDecodingProgress(progress);
    };

    // info
    const videoProperties = await getVideoProperties(ffmpeg, 'input.mp4');
    console.log('infoResult', videoProperties);

    // captions
    await ffmpeg.createDir('captions');
    await ffmpeg.createDir('videos');

    const imageTimePairs: {timecode: number, imageFileName: string, x: number, y: number, videoFileName: string}[] = [];
    let imageNumber = 0;
    for (const userPhrase of userPhrases) {
        const collection = collections.find(c => c.id === userPhrase.collectionId)!;
        const itemIndex = collection.items.findIndex(item => item.id === userPhrase.phraseId);
        const item = collection.items[itemIndex];
        const itemsBefore = collection.items.slice(0, itemIndex);
        const phrase = userPhrase.text!;
        const timecode = itemsBefore
            .map(r => r.duration)
            .reduce((acc, ii) => acc + ii, 0);

        const fileNumberSuffix = imageNumber.toString().padStart(5, '0');

        const fetchedFile = await fetchFile(item.videoFile);
        const videoFileName = `videos/${fileNumberSuffix}.mp4`;
        await ffmpeg.writeFile(videoFileName, fetchedFile);

        const {x, y, width, height} = collection.textArea;
        const blob = await renderTextSlide(width, height, phrase);
        const imageFileName = `captions/${fileNumberSuffix}.png`;
        await ffmpeg.writeFile(imageFileName, new Uint8Array(await blob.arrayBuffer()));

        imageTimePairs.push({timecode, imageFileName, x, y, videoFileName});
        imageNumber++;
    }

    const concatBody = imageTimePairs.map(f => `file '${f.videoFileName}'`).join('\n');

    await ffmpeg.writeFile('concat.txt', new Uint8Array(
        await (new Blob([concatBody], {type: 'text/plain'}).arrayBuffer())
    ));

    const watermarkFile = await fetchFile('watermark.png');
    await ffmpeg.writeFile('watermark.png', watermarkFile);

    console.log('dir [.]', await listFiles(ffmpeg, '.'));

    const compileCommandArgs: string[] = ['-f', 'concat', '-i', 'concat.txt'];

    for (let i = 0; i < imageTimePairs.length; i++) {
        const {imageFileName} = imageTimePairs[i];
        compileCommandArgs.push('-i', imageFileName);
    }

    const complexFilter: string[] = [];
    for (let i = 0; i < imageTimePairs.length; i++) {
        const {timecode, x, y } = imageTimePairs[i];
        const startTag = i === 0
            ? '[0:v]'
            : `[v${i}]`;
        const startTime = `${timecode.toFixed(3)}`;
        const endTime = i === imageTimePairs.length - 1
            ? 'inf'
            : `${imageTimePairs[i + 1].timecode.toFixed(3)}`;
        complexFilter.push(`${startTag}[${i + 1}:v]overlay=${x}:${y}:enable='between(t,${startTime},${endTime})'[v${i + 1}]`);
    }

    // watermark
    const collection = collections.find(c => c.id === userPhrases[0].collectionId)!;
    const {watermarkArea} = collection;
    complexFilter.push(`[v${imageTimePairs.length}][${imageTimePairs.length + 1}:v]overlay=${watermarkArea.x}:${watermarkArea.y}[v${imageTimePairs.length + 1}]`)

    compileCommandArgs.push(
        '-i', 'watermark.png',
        '-filter_complex', complexFilter.join(';'),
        '-map', `[v${complexFilter.length}]`,
        '-map', '0:a',

        // video
        '-c:v', 'libx264',
        '-profile:v', 'high',
        '-level:v', '4.0',
        '-pix_fmt', 'yuv420p',
        '-colorspace:v', 'bt709',
        '-color_primaries:v', 'bt709', '-color_trc:v', 'bt709', '-color_range:v', 'tv', '-bsf:v',
        'h264_metadata=chroma_sample_loc_type=0',

        // audio
        '-c:a', 'aac', '-b:a', '128k',

        // common
        '-x264opts', 'opencl', // slight boost
        '-brand', 'mp42', // brand compat
        '-preset', 'ultrafast', // super fast preset
        '-movflags', '+faststart', // ability to start video earlier (streaming?)

        // output file
        'output.mp4'
    );

    console.log(compileCommandArgs.join(' '));

    // montage
    setDecodingStatus('converting video...');
    await ffmpegExec(ffmpeg, compileCommandArgs, updateDecodingStatus);

    setDecodingStatus('reading output video...');
    const data = await ffmpeg.readFile('output.mp4') as Uint8Array;
    const result = new Blob([data.buffer], {type: 'video/mp4'});

    setDecodingStatus('previewing video...');
    setDecodingStatus('ready 👌');

    // cleanup
    for (const {imageFileName, videoFileName} of imageTimePairs) {
        await ffmpeg.deleteFile(imageFileName);
        await ffmpeg.deleteFile(videoFileName);
    }
    await ffmpeg.deleteDir('captions');
    await ffmpeg.deleteDir('videos');
    await ffmpeg.deleteFile('output.mp4');
    await ffmpeg.deleteFile('concat.txt');
    await ffmpeg.deleteFile('watermark.png');
    console.log('dir [.]', await listFiles(ffmpeg, '.'));

    return result;
};

export const debugCanvas = (canvas: HTMLCanvasElement) => {
    const {width, height} = canvas;
    const img = canvas.toDataURL('image/png');
    console.log(img);
    console.log('%c ', `color: transparent;font-size:1px;width:${width}px;height:${height}px;background:transparent url('${img}') no-repeat 0 0;background-zie: ${width}px ${height}px;`);
};
