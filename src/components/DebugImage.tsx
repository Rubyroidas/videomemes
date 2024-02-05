import {FC, useEffect, useRef} from 'react';
import styled from '@emotion/styled';

import {renderImageSlide, renderTextSlide} from '../generate';
import {html2text} from '../utils';
import {Collection, Format, UserPhrase, UserPhraseType} from '../types';
import {formatSizes} from '../statics';

const Wrapper = styled.canvas`
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
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const render = async () => {
            if (!canvasRef.current) {
                return;
            }

            const ctx = canvasRef.current.getContext('2d')!;
            const {width, height} = collection.textArea[format];
            const collectionSize = formatSizes[format];
            let canvas: HTMLCanvasElement;

            canvasRef.current.width = width;
            canvasRef.current.height = height;

            if (type === UserPhraseType.PlainText) {
                canvas = await renderTextSlide(collectionSize, width, height, html2text(text), textSize);
            } else {
                canvas = await renderImageSlide(width, height, image!, imageSize, background);
            }

            ctx.clearRect(0, 0, width, height);
            ctx.drawImage(canvas, 0, 0);
        };
        render();
    }, [text, textSize, image, imageSize]);

    return (
        <Wrapper ref={canvasRef}/>
    );
};
