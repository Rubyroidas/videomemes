import {FC, useEffect, useRef} from 'react';
import styled from '@emotion/styled';

import {renderTextSlide} from '../generate';
import {html2text} from '../utils';
import {Collection, TextSize} from '../types';

const Wrapper = styled.img`
    position: absolute;
`;

type Props = {
    collection: Collection;
    text: string;
    textSize: TextSize;
}

export const DebugImage: FC<Props> = ({collection, text, textSize}) => {
    const debugImage = useRef<HTMLImageElement>(null);
    useEffect(() => {
        const render = async () => {
            const {width, height} = collection.textArea;
            const blob = await renderTextSlide(collection.size, width, height, html2text(text), textSize);

            const img = debugImage.current!;
            img.src = URL.createObjectURL(blob);
        };
        render();
    }, [text]);

    return (
        <Wrapper ref={debugImage}/>
    );
};
