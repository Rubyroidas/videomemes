import {FFmpeg} from '@ffmpeg/ffmpeg';
import {fetchFile} from '@ffmpeg/util';

import {Collection, Rect, Size, UserPhrase} from './types';
import {
    ffmpegExec,
    ffmpegListFiles,
    getVideoProperties,
    hexToUint8Array,
    ProgressEvent,
    reduceWideLines
} from './utils';
import {FONT_SIZE, LINE_HEIGHT, TEXT_COLOR, TEXT_PADDING} from './config';
import watermarkRaw from './icons/watermark.png?raw-hex';

export const renderTextSlide = async (videoSize: Size, width: number, height: number, text: string) => {
    text = (text ?? '').trim();
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const fontSize = FONT_SIZE * videoSize.width;
    const lineHeight = fontSize * LINE_HEIGHT;
    const padding = TEXT_PADDING * videoSize.width / 100;
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
    setEncodingProgress: (progress: number) => void,
    setEncodingStatus: (status: string) => void
): Promise<Blob> => {
    const updateEncodingStatus = ({progress}: ProgressEvent) => {
        setEncodingProgress(progress);
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
        const blob = await renderTextSlide(collection.size, width, height, phrase);
        const imageFileName = `captions/${fileNumberSuffix}.png`;
        await ffmpeg.writeFile(imageFileName, new Uint8Array(await blob.arrayBuffer()));

        imageTimePairs.push({timecode, imageFileName, x, y, videoFileName});
        imageNumber++;
    }

    const concatBody = imageTimePairs.map(f => `file '${f.videoFileName}'`).join('\n');

    await ffmpeg.writeFile('concat.txt', new Uint8Array(
        await (new Blob([concatBody], {type: 'text/plain'}).arrayBuffer())
    ));

    const watermarkFile = hexToUint8Array(watermarkRaw);
    await ffmpeg.writeFile('watermark.png', watermarkFile);

    console.log('dir [.]', await ffmpegListFiles(ffmpeg, '.'));

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
    setEncodingStatus('converting video...');
    await ffmpegExec(ffmpeg, compileCommandArgs, updateEncodingStatus);

    setEncodingStatus('reading output video...');
    const data = await ffmpeg.readFile('output.mp4') as Uint8Array;
    const result = new Blob([data.buffer], {type: 'video/mp4'});

    setEncodingStatus('previewing video...');
    setEncodingStatus('ready 👌');

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
    console.log('dir [.]', await ffmpegListFiles(ffmpeg, '.'));

    return result;
};
