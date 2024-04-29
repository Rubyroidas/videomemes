import {FFmpeg} from '@ffmpeg/ffmpeg';
import {fetchFile} from '@ffmpeg/util';

import {Collection, Format, Rect, Size, UserFragment, UserFragmentType} from './types';
import {
    consoleLog,
    ffmpegExec,
    ffmpegListFilesRaw,
    hexToUint8Array,
    imageLoadPromise,
    reduceWideLines,
    ProgressEvent,
} from './utils';
import {FONT_SIZE, LINE_HEIGHT, TEXT_COLOR, TEXT_PADDING} from './config';
import watermarkRaw2 from './icons/watermark.svg?raw';
import {formatSizes} from './statics';
import silence from './500ms-silence.mp3?raw-hex';

export const renderTextSlide = async (videoSize: Size, width: number, height: number, text: string, textSizeCoeff: number) => {
    text = (text ?? '').trim();
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const minVideoSize = Math.min(videoSize.width, videoSize.height);
    const fontSize = textSizeCoeff * FONT_SIZE * minVideoSize;
    const lineHeight = fontSize * LINE_HEIGHT;
    const padding = TEXT_PADDING * minVideoSize / 100;
    const textBounds: Rect = {
        x: padding,
        y: padding,
        width: width - padding * 2,
        height: height - padding * 2,
    };

    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = TEXT_COLOR;
    ctx.textBaseline = 'alphabetic';
    ctx.textAlign = 'center';
    ctx.font = `bold ${fontSize}px sans-serif`;
    const getTextWidth = (text: string) => ctx.measureText(text).width;
    const lines: string[] = [...reduceWideLines(getTextWidth, text, textBounds.width)];
    const linesHeights: {width: number, height: number, measure: TextMetrics}[] = lines.map(line => {
        const measure = ctx.measureText(line);
        return {
            width: measure.width,
            height: (measure.fontBoundingBoxAscent + measure.fontBoundingBoxDescent) * LINE_HEIGHT,
            measure,
        };
    });

    // const totalTextHeight = linesHeights.reduce<number>((acc, i) => acc + i.height, 0);
    let y = textBounds.x + textBounds.height / 2 - lineHeight * lines.length / 2;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const measure = linesHeights[i].measure;
        ctx.fillText(line, width / 2, y + measure.fontBoundingBoxAscent);
        y += lineHeight;
    }

    return canvas;
};

export const blobToCanvas = async (blob: Blob): Promise<HTMLCanvasElement> => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const img = document.createElement('img');

    img.src = URL.createObjectURL(blob);
    await imageLoadPromise(img);
    URL.revokeObjectURL(img.src);

    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    ctx.drawImage(img, 0, 0);

    return canvas;
};

export const canvasToBlob = async (canvas: HTMLCanvasElement, mimeType: string = 'image/png'): Promise<Blob> => {
    return await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(blob => {
            if (blob) {
                resolve(blob);
            } else {
                reject();
            }
        }, mimeType);
    });
};

export const renderImageSlide = async (width: number, height: number, blob: Blob | HTMLCanvasElement, imageSize: number, background?: string) => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d')!;

    ctx.clearRect(0, 0, width, height);
    if (background) {
        ctx.fillStyle = background;
        ctx.fillRect(0, 0, width, height);
    }

    const image = blob.constructor === Blob
        ? await blobToCanvas(blob)
        : blob as HTMLCanvasElement;
    const isWider = image.width / image.height > width / height;
    const imageScale = imageSize * (
        isWider
            ? width / image.width
            : height / image.height
    );
    const scaledSize: Size = {
        width: image.width * imageScale,
        height: image.height * imageScale,
    };
    ctx.drawImage(image,
        width / 2 - scaledSize.width / 2,
        height / 2 - scaledSize.height / 2,
        scaledSize.width, scaledSize.height
    );

    return canvas;
};

const codecsParams: Record<string, string[]> = {
    video: [
        '-c:v', 'libx264',
        '-profile:v', 'high',
        '-level:v', '4.0',
        '-pix_fmt', 'yuv420p',
        '-colorspace:v', 'bt709',
        '-color_primaries:v', 'bt709', '-color_trc:v', 'bt709', '-color_range:v', 'tv', '-bsf:v',
        'h264_metadata=chroma_sample_loc_type=0',
    ],
    audio: [
        '-c:a', 'aac', '-b:a', '128k', '-ar', '44100',
    ],
    common: [
        '-x264opts', 'opencl', // slight boost
        '-brand', 'mp42', // brand compat
        '-preset', 'ultrafast', // super fast preset
        '-movflags', '+faststart', // ability to start video earlier (streaming?)
    ],
};

const createWaterMarkData = async (size: Size) => new Uint8Array(
    await (
        (await canvasToBlob(
            await renderImageSlide(
                size.width,
                size.height,
                new Blob([watermarkRaw2], {type: 'image/svg+xml'}),
                1)
        ))
    ).arrayBuffer()
);

export const generateVideoTitleImage = async (text: string, format: Format): Promise<HTMLCanvasElement> => {
    const size = formatSizes[format];
    return await renderTextSlide(
        size,
        size.width, size.height,
        text, 1
    );
};

export const generateVideoTitleVideo = async (ffmpeg: FFmpeg, text: string, format: Format, fileName: string, duration: number) => {
    consoleLog('producing title: start');
    const canvas = await generateVideoTitleImage(text, format);
    const imageFileName = 'caption_title.png';
    const silenceFileName = 'silence.mp3';
    await ffmpeg.writeFile(imageFileName, new Uint8Array(await (await canvasToBlob(canvas)).arrayBuffer()));
    await ffmpeg.writeFile(silenceFileName, hexToUint8Array(silence));

    // montage
    await ffmpegExec(ffmpeg, [
        '-t', duration.toString(),
        '-loop', '1',
        '-i', imageFileName,
        '-i', silenceFileName,

        ...codecsParams.audio, '-shortest',
        ...codecsParams.video,
        ...codecsParams.common,

        // output file
        fileName
    ], () => {});
    await ffmpeg.deleteFile(imageFileName);
    await ffmpeg.deleteFile(silenceFileName);
    consoleLog('producing title: done');
};

type ImageTimePair = {
    timecode: number;
    imageFileName: string;
    x: number;
    y: number;
    videoFileName: string;
};

const TITLE_LENGTH = 2; // seconds
const TITLE_FILE = 'title.mp4';

export const generateVideo = async (
    ffmpeg: FFmpeg,
    videoTitle: string | undefined,
    userFragments: UserFragment[],
    collections: Collection[],
    format: Format,
    setEncodingProgress?: ((progress: number) => void),
    signal?: AbortSignal
): Promise<Blob> => {
    const updateEncodingStatus = ({progress}: ProgressEvent) => {
        setEncodingProgress?.(progress);
    };
    // create dirs
    await ffmpeg.createDir('captions');
    await ffmpeg.createDir('videos');

    const imageTimePairs: ImageTimePair[] = [];
    let imageNumber = 0;
    let timeShift = 0;
    const collectionSize = formatSizes[format];

    consoleLog('videoTitle', videoTitle);
    if (videoTitle) {
        await generateVideoTitleVideo(ffmpeg, videoTitle, format, TITLE_FILE, TITLE_LENGTH);
        timeShift += TITLE_LENGTH;
    }

    for (const userFragment of userFragments) {
        const collection = collections.find(c => c.id === userFragment.collectionId)!;
        const itemIndex = collection.items.findIndex(item => item.id === userFragment.fragmentId);
        const item = collection.items[itemIndex];
        const fileNumberSuffix = imageNumber.toString().padStart(5, '0');

        const fetchedFile = await fetchFile(item.templates[format]);
        const videoFileName = `videos/${fileNumberSuffix}.mp4`;
        await ffmpeg.writeFile(videoFileName, fetchedFile);

        const {x, y, width, height} = collection.textArea[format];
        const blob = userFragment.type === UserFragmentType.PlainText
            ? await renderTextSlide(collectionSize, width, height, userFragment.text, userFragment.textSize)
            : await renderImageSlide(width, height, userFragment.image!, userFragment.imageSize, '#fff');
        const imageFileName = `captions/${fileNumberSuffix}.png`;
        const imageBlob = await canvasToBlob(blob);
        await ffmpeg.writeFile(imageFileName, new Uint8Array(await imageBlob.arrayBuffer()));

        imageTimePairs.push({
            timecode: timeShift,
            imageFileName,
            x,
            y,
            videoFileName
        });
        timeShift += item.duration;
        imageNumber++;
    }

    const compileCommandArgs: string[] = [];
    if (videoTitle) {
        compileCommandArgs.push('-i', TITLE_FILE);
    }
    for (let i = 0; i < imageTimePairs.length; i++) {
        const {videoFileName} = imageTimePairs[i];
        compileCommandArgs.push('-i', videoFileName);
    }
    for (let i = 0; i < imageTimePairs.length; i++) {
        const {imageFileName} = imageTimePairs[i];
        compileCommandArgs.push('-i', imageFileName);
    }
    compileCommandArgs.push('-i', 'watermark.png');
    consoleLog('input files', compileCommandArgs);

    const complexFilter: string[] = [];
    const fileIndexOffset = videoTitle ? 1 : 0;
    const concatFilter: string[] = [];
    if (videoTitle) {
        concatFilter.push(`[0:v][0:a]`);
    }
    for (let i = 0; i < imageTimePairs.length; i++) {
        const videoIndex = fileIndexOffset + i;
        concatFilter.push(`[${videoIndex}:v][${videoIndex}:a]`);
    }
    concatFilter.push(`concat=n=${fileIndexOffset + imageTimePairs.length}:v=1:a=1[vraw][araw]`);
    complexFilter.push(concatFilter.join(''));

    for (let i = 0; i < imageTimePairs.length; i++) {
        const {timecode, x, y } = imageTimePairs[i];
        const imageIndex = fileIndexOffset + imageTimePairs.length + i;
        const startTag = i === 0
            ? '[vraw]'
            : `[cap${i}]`;
        const endTag = `[cap${i + 1}]`;
        const startTime = `${timecode.toFixed(3)}`;
        const endTime = i === imageTimePairs.length - 1
            ? 'inf'
            : `${imageTimePairs[i + 1].timecode.toFixed(3)}`;
        complexFilter.push(`${startTag}[${imageIndex}:v]overlay=${x}:${y}:enable='between(t,${startTime},${endTime})'${endTag}`);
    }

    // watermark
    const collection = collections.find(c => c.id === userFragments[0].collectionId)!;
    const watermarkArea = collection.watermarkArea[format];

    const watermarkFile = await createWaterMarkData(watermarkArea);
    await ffmpeg.writeFile('watermark.png', watermarkFile);

    const watermarkIndex = fileIndexOffset + imageTimePairs.length * 2;
    complexFilter.push(`[cap${imageTimePairs.length}][${watermarkIndex}:v]overlay=${watermarkArea.x}:${watermarkArea.y}[watermark]`)

    compileCommandArgs.push(
        '-filter_complex', complexFilter.join(';'),
        '-map', `[watermark]`,
        '-map', '[araw]',

        ...codecsParams.video,
        ...codecsParams.audio,
        ...codecsParams.common,

        // output file
        'output.mp4'
    );

    consoleLog('dir [.]', await ffmpegListFilesRaw(ffmpeg, '.'));
    consoleLog('dir [videos]', await ffmpegListFilesRaw(ffmpeg, './videos'));
    consoleLog('dir [captions]', await ffmpegListFilesRaw(ffmpeg, './captions'));
    consoleLog(compileCommandArgs.join(' '));

    // montage
    const output = await ffmpegExec(ffmpeg, compileCommandArgs, updateEncodingStatus, signal);
    consoleLog(output.stderr);
    consoleLog('AFTER >>> dir [.]', await ffmpegListFilesRaw(ffmpeg, '.'));

    const data = await ffmpeg.readFile('output.mp4') as Uint8Array;
    const result = new Blob([data.buffer], {type: 'video/mp4'});
    consoleLog('generate result (blob)', result);

    // cleanup
    for (const {imageFileName, videoFileName} of imageTimePairs) {
        consoleLog('remove files', imageFileName, videoFileName);
        await ffmpeg.deleteFile(imageFileName);
        await ffmpeg.deleteFile(videoFileName);
    }
    if (videoTitle) {
        await ffmpeg.deleteFile(TITLE_FILE);
    }
    await ffmpeg.deleteDir('captions');
    await ffmpeg.deleteDir('videos');
    await ffmpeg.deleteFile('output.mp4');
    await ffmpeg.deleteFile('watermark.png');
    consoleLog('dir [.]', await ffmpegListFilesRaw(ffmpeg, '.'));

    return result;
};
