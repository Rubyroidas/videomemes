import {ClipboardEventHandler, FC, MouseEventHandler, useRef, useState} from 'react';
import ContentEditable, {ContentEditableEvent} from 'react-contenteditable';
import {Box, Slider, Typography} from '@mui/material';
import {FileUploader} from 'react-drag-drop-files';

import {PlayIcon} from '../../icons/PlayIcon';
import {Point, Rect, TextSize, UserPhrase} from '../../types';
import {FONT_SIZE, TEXT_PADDING} from '../../config';
import {
    EditingAreaContainer,
    EditingVideo,
    InputBackground,
    PlayButton,
    TextAreaClass,
} from './PhraseEditor.styles';
import {useStore} from '../../store';
import {Button, ButtonSelector} from '../App.styles';
import {DebugImage} from '../DebugImage';
import {formatSizes} from '../../statics';

type PhraseEditorProps = {
    disabled: boolean;
    userPhrase: UserPhrase;
    onChange: (phrases: UserPhrase) => void;
}

const textSizeValues = [{
    value: TextSize.Small,
    text: 'small',
}, {
    value: TextSize.Normal,
    text: 'normal',
}, {
    value: TextSize.Big,
    text: 'big',
}];

export const PhraseEditor: FC<PhraseEditorProps> = (props) => {
    const {disabled, userPhrase, onChange} = props;
    const store = useStore();
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);

    const handlePhraseChange = (e: ContentEditableEvent) => {
        onChange({
            ...userPhrase,
            text: e.target.value,
        });
    };
    const handlePaste: ClipboardEventHandler = (e) => {
        e.preventDefault();
        document.execCommand('inserttext', false, e.clipboardData.getData('text/plain'));
    };
    const handleVideoClick: MouseEventHandler = (e) => {
        const video = e.target as HTMLVideoElement;
        if (video.paused) {
            video.play();
            setIsVideoPlaying(true);
        } else {
            video.pause();
            setIsVideoPlaying(false);
        }
    };
    const handleChangeTextSize = (value: TextSize) => {
        onChange({
            ...userPhrase,
            textSize: value,
        });
    };
    const handleChangeImageSize = (value: number) => {
        onChange({
            ...userPhrase,
            imageSize: value,
        });
    };
    const handleDrop = (file: File) => {
        onChange({
            ...userPhrase,
            text: undefined,
            image: file,
        });
    };
    const handleClickSwitchToTextMode = () => {
        onChange({
            ...userPhrase,
            text: '<div>Enter some text...</div>',
            image: undefined,
        });
    };

    if (!store.scenario) {
        return null;
    }

    const format = store.scenario.format;

    const collection = store.collections!.find(c => c.id === userPhrase.collectionId)!;
    const item = collection.items.find(item => item.id === userPhrase.phraseId)!;
    const collectionSize = formatSizes[store.scenario.format];
    const textAreaRect = collection.textArea[format];

    const virtualRect: Rect = {
        x: textAreaRect.x / collectionSize.width * 100,
        y: textAreaRect.y / collectionSize.height * 100,
        width: textAreaRect.width / collectionSize.width * 100,
        height: textAreaRect.height / collectionSize.height * 100,
    };
    let textSizeCoeff = 1;
    switch (userPhrase.textSize) {
        case TextSize.Small:
            textSizeCoeff = 0.5;
            break;
        case TextSize.Big:
            textSizeCoeff = 1.5;
            break;
    }
    const minCollectionSize = Math.min(collectionSize.width, collectionSize.height);
    const fontSizeDesktop = textSizeCoeff * FONT_SIZE * minCollectionSize;
    const fontSizeMobile = textSizeCoeff * FONT_SIZE * 100;
    const paddingDesktop = TEXT_PADDING * minCollectionSize / 100;
    const paddingMobile = TEXT_PADDING;
    const inputClassName = TextAreaClass(fontSizeDesktop, fontSizeMobile, paddingDesktop, paddingMobile, item.text);
    const playButtonPosition: Point = {
        x: collection.playButton[format].x / collectionSize.width * 100,
        y: collection.playButton[format].y / collectionSize.height * 100,
    };

    return (
        <div>
            {userPhrase.text ? (
                <>
                    <ButtonSelector
                        caption="Text size"
                        value={userPhrase.textSize}
                        values={textSizeValues}
                        onChange={handleChangeTextSize}
                    />
                    <FileUploader
                        types={['png', 'jpeg', 'jpg']}
                        multiple={false}
                        handleChange={handleDrop}
                    />
                </>
            ) : (
                <>
                    <Box>
                        <Typography>Image size</Typography>
                        <Slider
                            aria-label="Image size"
                            min={0.25}
                            step={0.25}
                            marks
                            max={3}
                            valueLabelDisplay="auto"
                            value={userPhrase.imageSize}
                            onChange={(_, value) => handleChangeImageSize(value as number)}
                        />
                    </Box>
                    <Button onClick={handleClickSwitchToTextMode}>
                        switch to text mode
                    </Button>
                </>
            )}
            <EditingAreaContainer {...collectionSize}>
                <InputBackground {...virtualRect}>
                    { userPhrase.image && (
                        <DebugImage
                            background="#fff"
                            collection={collection}
                            format={format}
                            text={userPhrase.text}
                            image={userPhrase.image}
                            textSize={userPhrase.textSize}
                            imageSize={userPhrase.imageSize}
                        />
                    ) }
                    {userPhrase.text && (
                        <ContentEditable
                            onPaste={handlePaste}
                            disabled={disabled}
                            className={inputClassName}
                            html={userPhrase.text!}
                            onChange={handlePhraseChange}
                        />
                    )}
                </InputBackground>
                <EditingVideo
                    ref={videoRef}
                    onClick={handleVideoClick}
                    controls={false}
                    loop={false}
                    src={`${item.templates[format]}#t=0.01`}
                    disablePictureInPicture={true}
                    disableRemotePlayback={true}
                    controlsList="nofullscreen"
                    playsInline={true}
                    preload="auto"
                    crossOrigin="anonymous"
                />
                {!isVideoPlaying && (
                    <PlayButton
                        position={playButtonPosition}
                    >
                        <PlayIcon/>
                    </PlayButton>
                )}
            </EditingAreaContainer>
        </div>
    );
};
