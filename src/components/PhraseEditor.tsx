import {ClipboardEventHandler, FC, MouseEventHandler, useState} from 'react';
import ContentEditable, {ContentEditableEvent} from 'react-contenteditable';

import {Collection, Rect, UserPhrase} from '../types';
import {escapeHTML, html2text} from '../utils';
import {FONT_SIZE, TEXT_PADDING} from '../config';
import {EditingAreaContainer, Header, InputBackground, TextAreaClass, Video} from './PhraseEditor.styles';
// import {renderTextSlide} from '../generate';

type PhraseEditorProps = {
    disabled: boolean;
    collections: Collection[];
    userPhrases: UserPhrase[];
    onChange: (phrases: UserPhrase[]) => void;
}

export const PhraseEditorProxy: FC<PhraseEditorProps> = (props) => {
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
    // const debugImage = useRef<HTMLImageElement>(null);
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
    // useEffect(() => {
    //     const render = async () => {
    //         const userPhrase = userPhrases[phraseIndex];
    //         const collection = collections.find(c => c.id === userPhrase.collectionId)!;
    //         const {width, height} = collection.textArea;
    //         const blob = await renderTextSlide(collection.size, width, height, html2text(userPhrase.text!));
    //
    //         const img = debugImage.current!;
    //         img.src = URL.createObjectURL(blob);
    //     };
    //     render();
    // }, [userPhrase.text]);

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
                <div>
                    {canGoLeft && (
                        <span onClick={() => setPhraseIndex(i => i - 1)}>⬅️</span>
                    )}
                    <span>
                    <span style={{color: '#888'}}>{phraseIndex + 1} / {userPhrases.length}</span>
                </span>
                    {canGoRight && (
                        <span onClick={() => setPhraseIndex(i => i + 1)}>➡️</span>
                    )}
                </div>
                <div>
                    <b>{collection.name}</b> "{item.name}"
                </div>
            </Header>
            <div>
                <EditingAreaContainer {...collection.size}>
                    <InputBackground {...virtualRect}>
                        {/*<DebugImage ref={debugImage}/>*/}
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
