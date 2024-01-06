import {ClipboardEventHandler, FC, MouseEventHandler, useState} from 'react';
import ContentEditable, {ContentEditableEvent} from 'react-contenteditable';

import {Collection, Rect, UserPhrase} from '../types';
import {escapeHTML, html2text} from '../utils';
import {FONT_SIZE, TEXT_PADDING} from '../config';
import {
    EditingAreaContainer,
    Header,
    InputBackground,
    NavigateCaption,
    TextAreaClass,
    Video
} from './PhraseEditor.styles';
import {NavigationBar} from './NavigationBar';
// import {DebugImage} from './DebugImage';

type PhraseEditorProps = {
    disabled: boolean;
    collections: Collection[];
    userPhrases: UserPhrase[];
    onChange: (phrases: UserPhrase[]) => void;
}

export const PhrasesEditor: FC<PhraseEditorProps> = (props) => {
    const {userPhrases, onChange, ...rest} = props;

    const onProxyChange = (phrases: UserPhrase[]) => {
        const escapedPhrases: UserPhrase[] = phrases.map(({text, ...ppp}) => {
            if (!text) {
                return {text, ...ppp};
            }

            return ({
                ...ppp,
                text: html2text(text),
            });
        });
        onChange(escapedPhrases);
    };

    const phrases = userPhrases.map(({text, ...ppp}) => ({
        ...ppp,
        text: text
            ? text.split('\n')
                .map((line) => `<div>${escapeHTML(line)}</div>`)
                .join('')
            : ''
    }));

    return (
        <PhraseEditor
            userPhrases={phrases}
            onChange={onProxyChange}
            {...rest}
        />
    );
};

export const PhraseEditor: FC<PhraseEditorProps> = (props) => {
    const {disabled, collections, userPhrases, onChange} = props;
    const [phraseIndex, setPhraseIndex] = useState(0);
    const handlePhraseChange = (e: ContentEditableEvent) => {
        const result = [...userPhrases];
        result[phraseIndex] = {
            ...result[phraseIndex],
            text: e.target.value,
        };
        onChange(result);
    };
    const handlePaste: ClipboardEventHandler = (e) => {
        e.preventDefault();
        document.execCommand('inserttext', false, e.clipboardData.getData('text/plain'));
    };
    const handleVideoClick: MouseEventHandler = (e) => {
        const video = e.target as HTMLVideoElement;
        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
    };

    const userPhrase = userPhrases[phraseIndex];

    const collection = collections.find(c => c.id === userPhrase.collectionId)!;
    const item = collection.items.find(item => item.id === userPhrase.phraseId)!;

    const canGoLeft = phraseIndex > 0;
    const canGoRight = phraseIndex < userPhrases.length - 1;

    const virtualRect: Rect = {
        x: collection.textArea.x / collection.size.width * 100,
        y: collection.textArea.y / collection.size.height * 100,
        width: collection.textArea.width / collection.size.width * 100,
        height: collection.textArea.height / collection.size.height * 100,
    };
    const fontSizeDesktop = FONT_SIZE * collection.size.width;
    const fontSizeMobile = FONT_SIZE * 100;
    const paddingDesktop = TEXT_PADDING * collection.size.width / 100;
    const paddingMobile = TEXT_PADDING;
    const inputClassName = TextAreaClass(fontSizeDesktop, fontSizeMobile, paddingDesktop, paddingMobile, item.name);

    return (
        <div>
            <Header>
                <NavigationBar
                    page={phraseIndex + 1}
                    totalPages={userPhrases.length}
                    canGoLeft={canGoLeft}
                    canGoRight={canGoRight}
                    setIndex={setPhraseIndex}
                />
                <NavigateCaption>
                    <b>{collection.name}</b> "{item.name}"
                </NavigateCaption>
            </Header>
            <div>
                <EditingAreaContainer {...collection.size}>
                    <InputBackground {...virtualRect}>
                        {/* userPhrase.text && (
                            <DebugImage
                                collection={collection}
                                text={userPhrase.text}
                            />
                        ) */}
                        <ContentEditable
                            onPaste={handlePaste}
                            disabled={disabled}
                            className={inputClassName}
                            html={userPhrase.text!}
                            onChange={handlePhraseChange}
                        />
                    </InputBackground>
                    <Video
                        onClick={handleVideoClick}
                        controls={false}
                        loop={false}
                        src={item.videoFile}
                        disablePictureInPicture={true}
                        disableRemotePlayback={true}
                        controlsList="nofullscreen"
                    />
                </EditingAreaContainer>
            </div>
        </div>
    );
};
