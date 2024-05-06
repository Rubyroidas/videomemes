import {ClipboardEventHandler, MouseEventHandler, useState} from 'react';
import ContentEditable, {ContentEditableEvent} from 'react-contenteditable';
import {Box, Slider, Typography} from '@mui/material';
import clsx from 'clsx';
import {useTranslation} from 'react-i18next';

import {PlayIcon} from '../../icons/PlayIcon';
import {Point, Rect, UserFragment, UserFragmentType} from '../../types';
import {FONT_SIZE, TEXT_PADDING} from '../../config';
import {
    EditingAreaContainer,
    EditingVideo,
    FileDropArea,
    FragmentEditorWrapper,
    FragmentSizeContainer,
    InputBackground,
    PlayButton,
    TextAreaClass,
} from './FragmentEditor.styles';
import {useStore} from '../../store';
import {Button} from '../App.styles';
import {DebugImage} from '../DebugImage';
import {formatSizes} from '../../statics';
import {useDropZone} from '../DropZone/DropZone';
import {blobToCanvas} from '../../generate';
import {SliderCheckbox} from '../SliderCheckbox';
import {AnalyticsEvent, sendAnalyticsEvent} from '../../services/analytics';

type FragmentEditorProps = {
    disabled: boolean;
    userFragment: UserFragment;
    onChange: (fragment: UserFragment) => void;
}

export const FragmentEditor = (props: FragmentEditorProps) => {
    const {t} = useTranslation();
    const {disabled, userFragment, onChange} = props;
    const store = useStore();
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);

    const handleFragmentChange =  (e: ContentEditableEvent) => {
        onChange({
            ...userFragment,
            text: e.target.value,
        });
    };
    const handleDrop = async (file: File) => {
        onChange({
            ...userFragment,
            type: UserFragmentType.PlainImage,
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
        sendAnalyticsEvent(AnalyticsEvent.EditFragment_VideoPreviewClicked, {
            play: video.paused,
        });
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
            ...userFragment,
            textSize: value,
        });
    };
    const handleChangeImageSize = (value: number) => {
        onChange({
            ...userFragment,
            imageSize: value,
        });
    };
    const handleSwitchMode = () => {
        const type = userFragment.type === UserFragmentType.PlainText
            ? UserFragmentType.PlainImage
            : UserFragmentType.PlainText;
        sendAnalyticsEvent(AnalyticsEvent.EditFragment_SwitchImageMode, {
            type,
        });
        onChange({
            ...userFragment,
            type,
        });
    };

    if (!store.scenario) {
        return null;
    }

    const format = store.scenario.format;
    const collection = store.getCollection(userFragment.collectionId)!;
    const item = store.getCollectionItem(userFragment.collectionId, userFragment.fragmentId)!;
    const collectionSize = formatSizes[store.scenario.format];
    const textAreaRect = collection.textArea[format];

    const virtualRect: Rect = {
        x: textAreaRect.x / collectionSize.width * 100,
        y: textAreaRect.y / collectionSize.height * 100,
        width: textAreaRect.width / collectionSize.width * 100,
        height: textAreaRect.height / collectionSize.height * 100,
    };
    const minCollectionSize = Math.min(collectionSize.width, collectionSize.height);
    const fontSizeDesktop = userFragment.textSize * FONT_SIZE * minCollectionSize;
    const fontSizeMobile = userFragment.textSize * FONT_SIZE * 100;
    const paddingDesktop = TEXT_PADDING * minCollectionSize / 100;
    const paddingMobile = TEXT_PADDING;
    const inputClassName = TextAreaClass(fontSizeDesktop, fontSizeMobile, paddingDesktop, paddingMobile);
    const playButtonPosition: Point = {
        x: collection.playButton[format].x / collectionSize.width * 100,
        y: collection.playButton[format].y / collectionSize.height * 100,
    };
    const isImage = userFragment.type === UserFragmentType.PlainImage;

    return (
        <FragmentEditorWrapper {...collectionSize}>
            <FragmentSizeContainer>
                <Button onClick={handleSwitchMode}>
                    {t('editFragments.text')}
                    <SliderCheckbox defaultChecked={isImage}/>
                    {t('editFragments.image')}
                </Button>
                <Box mr={1} ml={1} className="slider">
                {!isImage && (
                    <>
                        <Typography>{t('editFragments.textSize')}</Typography>
                        <Slider
                            aria-label="Text size"
                            min={0.5}
                            step={0.1}
                            marks
                            max={3}
                            valueLabelDisplay="on"
                            value={userFragment.textSize}
                            onChange={(_, value) => handleChangeTextSize(value as number)}
                        />
                    </>
                )}
                {isImage && (
                    <>
                        <Typography>{t('editFragments.imageSize')}</Typography>
                        <Slider
                            aria-label="Image size"
                            min={0.5}
                            step={0.1}
                            marks
                            max={3}
                            valueLabelDisplay="on"
                            value={userFragment.imageSize}
                            onChange={(_, value) => handleChangeImageSize(value as number)}
                        />
                    </>
                )}
                </Box>
            </FragmentSizeContainer>
            <EditingAreaContainer {...collectionSize}>
                <InputBackground {...virtualRect}>
                    {!isImage && (
                        <ContentEditable
                            onPaste={handlePaste}
                            disabled={disabled}
                            className={inputClassName}
                            html={userFragment.text}
                            onChange={handleFragmentChange}
                        />
                    )}
                    {isImage && (
                        <>
                            { userFragment.image && (
                                <DebugImage
                                    background="#fff"
                                    collection={collection}
                                    format={format}
                                    userFragment={userFragment}
                                />
                            ) }
                            <FileDropArea
                                {...dropZoneProps}
                                className={clsx({big: isDraggingOver || !userFragment.image})}
                            >
                                <div>{t('editFragments.dropImageHere')}</div>
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
        </FragmentEditorWrapper>
    );
};
