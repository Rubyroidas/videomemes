import {FFmpeg} from '@ffmpeg/ffmpeg';
import {fetchFile} from '@ffmpeg/util';

import {Collection, Format, Rect, Size, TextSize, UserPhrase} from './types';
import {
    ffmpegExec,
    ffmpegListFiles,
    getVideoProperties,
    imageLoadPromise,
    reduceWideLines
} from './utils';
import {FONT_SIZE, LINE_HEIGHT, TEXT_COLOR, TEXT_PADDING} from './config';
import watermarkRaw2 from './icons/watermark.svg?raw';
import {formatSizes} from './statics';

export const renderTextSlide = async (videoSize: Size, width: number, height: number, text: string, textSize: TextSize) => {
    text = (text ?? '').trim();
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    let textSizeCoeff = 1;
    switch (textSize) {
        case TextSize.Small:
            textSizeCoeff = 0.5;
            break;
        case TextSize.Big:
            textSizeCoeff = 1.5;
            break;
    }
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

export const renderImageSlide = async (width: number, height: number, image: Blob, imageSize: number, background?: string) => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d')!;

    ctx.clearRect(0, 0, width, height);
    if (background) {
        ctx.fillStyle = background;
        ctx.fillRect(0, 0, width, height);
    }

    const img = document.createElement('img');
    img.src = URL.createObjectURL(image);

    await imageLoadPromise(img);
    URL.revokeObjectURL(img.src)
    const isWider = img.naturalWidth / img.naturalHeight > width / height;
    const imageScale = imageSize * (
        isWider
            ? width / img.naturalWidth
            : height / img.naturalHeight
    );
    const scaledSize: Size = {
        width: img.naturalWidth * imageScale,
        height: img.naturalHeight * imageScale,
    };
    ctx.drawImage(img,
        width / 2 - scaledSize.width / 2,
        height / 2 - scaledSize.height / 2,
        scaledSize.width, scaledSize.height
    );

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
    format: Format
): Promise<Blob> => {
    // info
    const videoProperties = await getVideoProperties(ffmpeg, 'input.mp4');
    if (__DEV__) {
        console.log('infoResult', videoProperties);
    }
    // captions
    await ffmpeg.createDir('captions');
    await ffmpeg.createDir('videos');

    const imageTimePairs: {timecode: number, imageFileName: string, x: number, y: number, videoFileName: string}[] = [];
    let imageNumber = 0;
    let timeShift = 0;
    for (const userPhrase of userPhrases) {
        const collection = collections.find(c => c.id === userPhrase.collectionId)!;
        const itemIndex = collection.items.findIndex(item => item.id === userPhrase.phraseId);
        const item = collection.items[itemIndex];
        const fileNumberSuffix = imageNumber.toString().padStart(5, '0');

        const fetchedFile = await fetchFile(item.templates[format]);
        const videoFileName = `videos/${fileNumberSuffix}.mp4`;
        await ffmpeg.writeFile(videoFileName, fetchedFile);

        const {x, y, width, height} = collection.textArea[format];
        const collectionSize = formatSizes[format];
        const blob = userPhrase.text
            ? await renderTextSlide(collectionSize, width, height, userPhrase.text, userPhrase.textSize)
            : await renderImageSlide(width, height, userPhrase.image!, userPhrase.imageSize, '#fff');
        const imageFileName = `captions/${fileNumberSuffix}.png`;
        await ffmpeg.writeFile(imageFileName, new Uint8Array(await blob.arrayBuffer()));

        imageTimePairs.push({timecode: timeShift, imageFileName, x, y, videoFileName});
        timeShift += item.duration;
        imageNumber++;
    }

    const concatBody = imageTimePairs.map(f => `file '${f.videoFileName}'`).join('\n');

    await ffmpeg.writeFile('concat.txt', new Uint8Array(
        await (new Blob([concatBody], {type: 'text/plain'}).arrayBuffer())
    ));

    if (__DEV__) {
        console.log('dir [.]', await ffmpegListFiles(ffmpeg, '.'));
    }
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
    const watermarkArea = collection.watermarkArea[format];

    const watermarkFile = new Uint8Array(
        await (
            await renderImageSlide(
                watermarkArea.width,
                watermarkArea.height,
                new Blob([watermarkRaw2], {type: 'image/svg+xml'}),
                1)
        ).arrayBuffer()
    );
    await ffmpeg.writeFile('watermark.png', watermarkFile);

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

    if (__DEV__) {
        console.log(compileCommandArgs.join(' '));
    }

    // montage
    await ffmpegExec(ffmpeg, compileCommandArgs, () => {});

    const data = await ffmpeg.readFile('output.mp4') as Uint8Array;
    const result = new Blob([data.buffer], {type: 'video/mp4'});

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
    if (__DEV__) {
        console.log('dir [.]', await ffmpegListFiles(ffmpeg, '.'));
    }

    return result;
};
