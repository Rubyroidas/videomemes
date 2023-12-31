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

const templateFile = 'tinkoff_3.mp4';
// const templateFile = 'tinkoff_output.mp4';
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

    setDecodingStatus('loading source video...');
    const fetchedFile = await fetchFile(templateFile);
    // videoRef.current.src = URL.createObjectURL(new Blob([fetchedFile.buffer], {type: 'video/mp4'}));

    setDecodingStatus('feeding source video to ffmpeg...');
    await ffmpeg.writeFile('input.mp4', fetchedFile);

    setDecodingStatus('extracting frames...');

    // info
    const videoProperties = await getVideoProperties(ffmpeg, 'input.mp4');
    console.log('infoResult', videoProperties);

    // captions
    await ffmpeg.createDir('captions');

    const imageTimePairs: {timecode: number, imageFileName: string, x: number, y: number, sourceVideoFile: string}[] = [];
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

        const {x, y, width, height} = collection.textArea;
        const blob = await renderTextSlide(width, height, phrase);
        const imageFileName = `captions/${imageNumber.toString().padStart(5, '0')}.png`;
        await ffmpeg.writeFile(imageFileName, new Uint8Array(await blob.arrayBuffer()));

        imageTimePairs.push({timecode, imageFileName, x, y, sourceVideoFile: item.videoFile});
        imageNumber++;
    }

    console.log('imageTimePairs', imageTimePairs);

    console.log('dir [.]', await listFiles(ffmpeg, '.'));
    console.log('dir [captions]', await listFiles(ffmpeg, 'captions'));

    const compileCommandArgs: string[] = ['-i', 'input.mp4'];

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

    compileCommandArgs.push('-filter_complex', complexFilter.join(';'));
    compileCommandArgs.push('-map', `[v${imageTimePairs.length}]`,
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

    // montage
    setDecodingStatus('converting video...');
    await ffmpegExec(ffmpeg, compileCommandArgs, updateDecodingStatus);

    setDecodingStatus('reading output video...');
    const data = await ffmpeg.readFile('output.mp4') as Uint8Array;
    const result = new Blob([data.buffer], {type: 'video/mp4'});

    setDecodingStatus('previewing video...');
    setDecodingStatus('ready 👌');

    // cleanup
    for (const {imageFileName} of imageTimePairs) {
        await ffmpeg.deleteFile(imageFileName);
    }
    await ffmpeg.deleteDir('captions');
    await ffmpeg.deleteFile('input.mp4');
    await ffmpeg.deleteFile('output.mp4');

    return result;
};

export const debugCanvas = (canvas: HTMLCanvasElement) => {
    const {width, height} = canvas;
    const img = canvas.toDataURL('image/png');
    console.log(img);
    console.log('%c ', `color: transparent;font-size:1px;width:${width}px;height:${height}px;background:transparent url('${img}') no-repeat 0 0;background-zie: ${width}px ${height}px;`);
};
