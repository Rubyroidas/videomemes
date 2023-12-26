import {FC, useEffect, useRef, useState} from 'react';
import {FFmpeg} from '@ffmpeg/ffmpeg';
import {fetchFile} from "@ffmpeg/util";

import {PhraseEditor} from '../PhraseEditor';
import {ProgressBar} from '../ProgressBar';
import {DownloadVideoButton} from '../DownloadVideoButton';
import {ffmpegExec, getVideoProperties, ProgressEvent} from '../utils';
import {PhraseConfig} from '../models';
import _tinkoffConfig from '../tinkoff.json';

import {Button} from '../App.styles';

type Props = {
    ffmpeg: FFmpeg
}

const tinkoffConfig: PhraseConfig[] = _tinkoffConfig;

const TEXT_COLOR = '#ff0000';
const TEXT_FONT = 'bold 24px sans-serif';
// const templateFile = 'tinkoff_output.mp4';

const templateFile = 'tinkoff_3.mp4';
const templateConfig = tinkoffConfig.slice(0, 3);
const listFiles = async (ffmpeg: FFmpeg, path: string)=>
    (await ffmpeg.listDir(path)).filter(p => !(['.', '..'].includes(p.name) && p.isDir));

const generateVideo = async (
    ffmpeg: FFmpeg,
    videoFiles: string[],
    phrases: string[],
    setDecodingProgress: (progress: number) => void,
    setDecodingStatus: (status: string) => void
): Promise<Blob> => {
    const updateDecodingStatus = ({progress}: ProgressEvent) => {
        setDecodingProgress(progress);
    };

    console.log(videoFiles);

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

    const width = 720;
    const height = 640;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const imageTimePairs: {timecode: number, imageFileName: string}[] = [];
    const ctx = canvas.getContext('2d')!;
    let imageNumber = 0;
    const currentConfig: PhraseConfig[] = templateConfig.map((p, index) => ({
        phrase: phrases[index],
        timecode: p.timecode,
    }));
    for (const {phrase, timecode} of currentConfig) {
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = TEXT_COLOR;
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        ctx.font = TEXT_FONT;
        ctx.fillText(phrase, width / 2, height / 2);

        const img = document.createElement('img');
        img.src = canvas.toDataURL('image/png');
        img.style.border = 'solid 1px red';

        try {
            const blob = await new Promise<Blob>((resolve, reject) => {
                canvas.toBlob(blob => {
                    if (blob) {
                        resolve(blob);
                    } else {
                        reject();
                    }
                }, 'image/png');
            });

            const imageFileName = `captions/${imageNumber.toString().padStart(5, '0')}.png`;
            await ffmpeg.writeFile(imageFileName, new Uint8Array(await blob.arrayBuffer()));

            imageTimePairs.push({timecode, imageFileName});
        } catch (e) {
            console.error(`error putting image #${imageNumber}`);
        }

        imageNumber++;
    }

    console.log('dir [.]', await listFiles(ffmpeg, '.'));
    console.log('dir [captions]', await listFiles(ffmpeg, 'captions'));

    const compileCommandArgs: string[] = ['-i', 'input.mp4'];

    for (let i = 0; i < imageTimePairs.length; i++) {
        const {imageFileName} = imageTimePairs[i];
        compileCommandArgs.push('-i', imageFileName);
    }

    const complexFilter: string[] = [];
    for (let i = 0; i < imageTimePairs.length; i++) {
        const {timecode } = imageTimePairs[i];
        const startTag = i === 0
            ? '[0:v]'
            : `[v${i}]`;
        const startTime = `${timecode.toFixed(3)}`;
        const endTime = i === imageTimePairs.length - 1
            ? 'inf'
            : `${imageTimePairs[i + 1].timecode.toFixed(3)}`;
        complexFilter.push(`${startTag}[${i + 1}:v]overlay=0:0:enable='between(t,${startTime},${endTime})'[v${i + 1}]`);
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

    setDecodingStatus('previewing video...');
    setDecodingStatus('ready 👌');

    console.log('dir [.]', await listFiles(ffmpeg, '.'));

    return new Blob([data.buffer], {type: 'video/mp4'});
};
export const VideoEditor: FC<Props> = ({ffmpeg}) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    const [phrases, setPhrases] = useState(templateConfig.map(p => p.phrase));
    const [isDecoding, setIsDecoding] = useState(false);
    const [decodingProgress, setDecodingProgress] = useState(0);
    const [decodingStatus, setDecodingStatus] = useState('');
    const [generatedVideo, setGeneratedVideo] = useState<Blob | null>(null);

    const handleGenerateClick = () => {
        (async () => {
            if (isDecoding || !videoRef.current) {
                console.log('return');
                return;
            }

            setIsDecoding(true);
            console.log('start');

            const vid = await generateVideo(ffmpeg, [templateFile], phrases, setDecodingProgress, setDecodingStatus);

            setGeneratedVideo(vid);
            setIsDecoding(false);
        })();
    };

    useEffect(() => {
        if (!videoRef.current || !generatedVideo) {
            return;
        }

        videoRef.current.src = URL.createObjectURL(generatedVideo);
    }, [generatedVideo]);

    return (
        <>
            <div>Encoding status: {decodingStatus}</div>
            <PhraseEditor
                phrasesConfig={templateConfig}
                phrases={phrases}
                onChange={setPhrases}
            />
            {!isDecoding && !generatedVideo && (
                <Button onClick={handleGenerateClick}>Generate</Button>
            )}
            {isDecoding && (
                <ProgressBar value={decodingProgress}/>
            )}
            {generatedVideo && (
                <div>
                    <DownloadVideoButton data={generatedVideo}/>
                </div>
            )}
            <video controls={true} ref={videoRef} style={{
                display: !generatedVideo ? 'none' : ''
            }}></video>
            {/*<video controls={true} src="./tinkoff_3.mp4"></video>*/}
        </>
    );
}