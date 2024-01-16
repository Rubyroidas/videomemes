import {FC, useEffect, useRef} from 'react';
import styled from '@emotion/styled';

import {renderImageSlide, renderTextSlide} from '../generate';
import {html2text} from '../utils';
import {Collection, TextSize} from '../types';

const Wrapper = styled.img`
    position: absolute;
`;

type Props = {
    background: string,
    collection: Collection;
    text?: string;
    image?: Blob;
    textSize: TextSize;
    imageSize: number;
}

export const DebugImage: FC<Props> = ({background, collection, text, textSize, image, imageSize}) => {
    const debugImage = useRef<HTMLImageElement>(null);
    useEffect(() => {
        const render = async () => {
            const {width, height} = collection.textArea;
            let blob;
            if (text !== undefined) {
                blob = await renderTextSlide(collection.size, width, height, html2text(text), textSize);
            } else {
                blob = await renderImageSlide(width, height, image!, imageSize, background);
            }

            const img = debugImage.current!;
            img.src = URL.createObjectURL(blob);
        };
        render();
    }, [text, textSize, image, imageSize]);

    return (
        <Wrapper ref={debugImage}/>
    );
};
