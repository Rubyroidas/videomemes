import {FC, useEffect, useRef} from 'react';
import styled from '@emotion/styled';

import {renderTextSlide} from '../generate';
import {html2text} from '../utils';
import {Collection} from '../types';

const Wrapper = styled.img`
   position: absolute;
 `;

type Props = {
    collection: Collection;
    text: string;
}

export const DebugImage: FC<Props> = ({collection, text}) => {
    const debugImage = useRef<HTMLImageElement>(null);
    useEffect(() => {
        const render = async () => {
            const {width, height} = collection.textArea;
            const blob = await renderTextSlide(collection.size, width, height, html2text(text));

            const img = debugImage.current!;
            img.src = URL.createObjectURL(blob);
        };
        render();
    }, [text]);

    return (
        <Wrapper ref={debugImage}/>
    );
};
