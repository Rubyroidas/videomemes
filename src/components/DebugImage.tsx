import {FC, useEffect, useRef} from 'react';
import styled from '@emotion/styled';

import {renderImageSlide, renderTextSlide} from '../generate';
import {html2text} from '../utils';
import {Collection, Format, TextSize} from '../types';
import {formatSizes} from '../statics';

const Wrapper = styled.img`
    position: absolute;
    width: 100%;
    height: 100%;
`;

type Props = {
    background: string,
    collection: Collection;
    format: Format;
    text?: string;
    image?: Blob;
    textSize: TextSize;
    imageSize: number;
}

export const DebugImage: FC<Props> = ({background, collection, format, text, textSize, image, imageSize}) => {
    const debugImage = useRef<HTMLImageElement>(null);
    useEffect(() => {
        const render = async () => {
            const {width, height} = collection.textArea[format];
            const collectionSize = formatSizes[format];
            let blob;
            if (text !== undefined) {
                blob = await renderTextSlide(collectionSize, width, height, html2text(text), textSize);
            } else {
                blob = await renderImageSlide(width, height, image!, imageSize, background);
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
    }, [text, textSize, image, imageSize]);

    return (
        <Wrapper ref={debugImage}/>
    );
};
