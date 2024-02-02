import {FC, useEffect, useRef} from 'react';
import styled from '@emotion/styled';

import {renderImageSlide, renderTextSlide} from '../generate';
import {html2text} from '../utils';
import {Collection, Format, UserPhrase, UserPhraseType} from '../types';
import {formatSizes} from '../statics';

const Wrapper = styled.img`
    position: absolute;
    width: 100%;
    height: 100%;
    pointer-events: none;
`;

type Props = {
    background: string;
    format: Format;
    collection: Collection;
    userPhrase: UserPhrase;
}

export const DebugImage: FC<Props> = ({background, collection, format, userPhrase}) => {
    const {type, text, textSize, image, imageSize} = userPhrase;
    const debugImage = useRef<HTMLImageElement>(null);

    useEffect(() => {
        let disposed = false;
        const render = async () => {
            const {width, height} = collection.textArea[format];
            const collectionSize = formatSizes[format];
            let blob;
            if (type === UserPhraseType.PlainText) {
                blob = await renderTextSlide(collectionSize, width, height, html2text(text), textSize);
            } else {
                blob = await renderImageSlide(width, height, image!, imageSize, background);
            }

            if (disposed) {
                return;
            }
            const img = debugImage.current!;
            const clear = () => {
                URL.revokeObjectURL(img.src);
                img.removeEventListener('load', clear);
            };
            img.src = URL.createObjectURL(blob);
            img.addEventListener('load', clear);
        };
        render();
        return () => {
            disposed = true;
        }
    }, [text, textSize, image, imageSize]);

    return (
        <Wrapper ref={debugImage}/>
    );
};
