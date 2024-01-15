import {ClipboardEventHandler, FC, MouseEventHandler, useEffect, useRef, useState} from 'react';
import ContentEditable, {ContentEditableEvent} from 'react-contenteditable';
import {FileUploader} from 'react-drag-drop-files';

import {PlayIcon} from '../icons/PlayIcon';
import {Point, Rect, TextSize, UserPhrase} from '../types';
import {FONT_SIZE, TEXT_PADDING} from '../config';
import {
    EditingAreaContainer,
    InputBackground,
    PlayButton,
    TextAreaClass,
    Video
} from './PhraseEditor.styles';
import {useStore} from '../store';
import {Button, ButtonSelector} from './App.styles';
// import {DebugImage} from './DebugImage';

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

const imageSizeValues = [{
    value: 0.5,
    text: 'half',
}, {
    value: 0.75,
    text: '3/4',
}, {
    value: 1,
    text: 'full',
}];

export const PhraseEditor: FC<PhraseEditorProps> = (props) => {
    const {disabled, userPhrase, onChange} = props;
    const store = useStore();
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const [imageBlobUrl, setImageBlobUrl] = useState<string | undefined>(undefined);

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
    useEffect(() => {
        if (userPhrase.image) {
            setImageBlobUrl(URL.createObjectURL(userPhrase.image));
        } else {
            setImageBlobUrl(undefined);
        }
    }, [userPhrase.image]);

    const collection = store.collections!.find(c => c.id === userPhrase.collectionId)!;
    const item = collection.items.find(item => item.id === userPhrase.phraseId)!;

    const virtualRect: Rect = {
        x: collection.textArea.x / collection.size.width * 100,
        y: collection.textArea.y / collection.size.height * 100,
        width: collection.textArea.width / collection.size.width * 100,
        height: collection.textArea.height / collection.size.height * 100,
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
    const fontSizeDesktop = textSizeCoeff * FONT_SIZE * collection.size.width;
    const fontSizeMobile = textSizeCoeff * FONT_SIZE * 100;
    const paddingDesktop = TEXT_PADDING * collection.size.width / 100;
    const paddingMobile = TEXT_PADDING;
    const inputClassName = TextAreaClass(fontSizeDesktop, fontSizeMobile, paddingDesktop, paddingMobile, item.name);
    const playButtonPosition: Point = {
        x: collection.playButton.x / collection.size.width * 100,
        y: collection.playButton.y / collection.size.height * 100,
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
                    <ButtonSelector
                        caption="Image size"
                        value={userPhrase.imageSize}
                        values={imageSizeValues}
                        onChange={handleChangeImageSize}
                    />
                    <Button onClick={handleClickSwitchToTextMode}>
                        switch to text mode
                    </Button>
                </>
            )}
            <EditingAreaContainer {...collection.size}>
                <InputBackground {...virtualRect} style={{
                    backgroundImage: imageBlobUrl ? `url(${imageBlobUrl})` : undefined,
                }}>
                    {/* userPhrase.text && (
                        <DebugImage
                            collection={collection}
                            text={userPhrase.text}
                            textSize={userPhrase.textSize}
                        />
                    ) */}
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
                <Video
                    ref={videoRef}
                    onClick={handleVideoClick}
                    controls={false}
                    loop={false}
                    src={item.videoFile}
                    disablePictureInPicture={true}
                    disableRemotePlayback={true}
                    controlsList="nofullscreen"
                    playsInline={true}
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
