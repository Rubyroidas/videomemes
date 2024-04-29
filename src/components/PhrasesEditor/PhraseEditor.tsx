import {ClipboardEventHandler, FC, MouseEventHandler, useState} from 'react';
import ContentEditable, {ContentEditableEvent} from 'react-contenteditable';
import {Box, Slider, Typography} from '@mui/material';
import clsx from 'clsx';

import {PlayIcon} from '../../icons/PlayIcon';
import {Point, Rect, UserPhrase, UserPhraseType} from '../../types';
import {FONT_SIZE, TEXT_PADDING} from '../../config';
import {
    EditingAreaContainer,
    EditingVideo,
    FileDropArea,
    InputBackground,
    PhraserEditorWrapper,
    PlayButton,
    TextAreaClass,
} from './PhraseEditor.styles';
import {useStore} from '../../store';
import {Button} from '../App.styles';
import {DebugImage} from '../DebugImage';
import {formatSizes} from '../../statics';
import {useDropZone} from '../DropZone/DropZone';
import {blobToCanvas} from '../../generate';
import {SliderCheckbox} from '../SliderCheckbox';

type PhraseEditorProps = {
    disabled: boolean;
    userPhrase: UserPhrase;
    onChange: (phrases: UserPhrase) => void;
}

export const PhraseEditor: FC<PhraseEditorProps> = (props) => {
    const {disabled, userPhrase, onChange} = props;
    const store = useStore();
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);

    const handlePhraseChange =  (e: ContentEditableEvent) => {
        onChange({
            ...userPhrase,
            text: e.target.value,
        });
    };
    const handleDrop = async (file: File) => {
        onChange({
            ...userPhrase,
            type: UserPhraseType.PlainImage,
            image: await blobToCanvas(file),
        });
    };
    const {isDraggingOver, ...dropZoneProps} = useDropZone({onDrop: handleDrop});
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
    const handleChangeTextSize = (value: number) => {
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
    const handleSwitchMode = () => {
        onChange({
            ...userPhrase,
            type: userPhrase.type === UserPhraseType.PlainText
                ? UserPhraseType.PlainImage
                : UserPhraseType.PlainText
        });
    };

    if (!store.scenario) {
        return null;
    }

    const format = store.scenario.format;
    const collection = store.getCollection(userPhrase.collectionId)!;
    const item = store.getCollectionItem(userPhrase.collectionId, userPhrase.fragmentId)!;
    const collectionSize = formatSizes[store.scenario.format];
    const textAreaRect = collection.textArea[format];

    const virtualRect: Rect = {
        x: textAreaRect.x / collectionSize.width * 100,
        y: textAreaRect.y / collectionSize.height * 100,
        width: textAreaRect.width / collectionSize.width * 100,
        height: textAreaRect.height / collectionSize.height * 100,
    };
    const minCollectionSize = Math.min(collectionSize.width, collectionSize.height);
    const fontSizeDesktop = userPhrase.textSize * FONT_SIZE * minCollectionSize;
    const fontSizeMobile = userPhrase.textSize * FONT_SIZE * 100;
    const paddingDesktop = TEXT_PADDING * minCollectionSize / 100;
    const paddingMobile = TEXT_PADDING;
    const inputClassName = TextAreaClass(fontSizeDesktop, fontSizeMobile, paddingDesktop, paddingMobile);
    const playButtonPosition: Point = {
        x: collection.playButton[format].x / collectionSize.width * 100,
        y: collection.playButton[format].y / collectionSize.height * 100,
    };

    return (
        <PhraserEditorWrapper {...collectionSize}>
            <Button onClick={handleSwitchMode}>
                text
                <SliderCheckbox defaultChecked={userPhrase.type === UserPhraseType.PlainImage}/>
                image
            </Button>
            {userPhrase.type === UserPhraseType.PlainText && (
                <Box mr={2} ml={2}>
                    <Typography>Image size</Typography>
                    <Slider
                        aria-label="Text size"
                        min={0.5}
                        step={0.1}
                        marks
                        max={3}
                        valueLabelDisplay="on"
                        value={userPhrase.textSize}
                        onChange={(_, value) => handleChangeTextSize(value as number)}
                    />
                </Box>
            )}
            {userPhrase.type === UserPhraseType.PlainImage && (
                <Box mr={2} ml={2}>
                    <Typography>Image size</Typography>
                    <Slider
                        aria-label="Image size"
                        min={0.5}
                        step={0.1}
                        marks
                        max={3}
                        valueLabelDisplay="on"
                        value={userPhrase.imageSize}
                        onChange={(_, value) => handleChangeImageSize(value as number)}
                    />
                </Box>
            )}
            <EditingAreaContainer {...collectionSize}>
                <InputBackground {...virtualRect}>
                    {userPhrase.type === UserPhraseType.PlainText && (
                        <ContentEditable
                            onPaste={handlePaste}
                            disabled={disabled}
                            className={inputClassName}
                            html={userPhrase.text}
                            onChange={handlePhraseChange}
                        />
                    )}
                    {userPhrase.type === UserPhraseType.PlainImage && (
                        <>
                            { userPhrase.image && (
                                <DebugImage
                                    background="#fff"
                                    collection={collection}
                                    format={format}
                                    userPhrase={userPhrase}
                                />
                            ) }
                            <FileDropArea
                                {...dropZoneProps}
                                className={clsx({big: isDraggingOver || !userPhrase.image})}
                            >
                                <div>Drop image here ...</div>
                            </FileDropArea>
                        </>
                    )}
                </InputBackground>
                <EditingVideo
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
                <PlayButton
                    position={playButtonPosition}
                    visible={!isVideoPlaying}
                >
                    <PlayIcon/>
                </PlayButton>
            </EditingAreaContainer>
        </PhraserEditorWrapper>
    );
};
