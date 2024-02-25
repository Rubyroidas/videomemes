import {useRef} from 'react';

import {generateVideoTitleImage} from '../generate';
import {Format} from '../types';
import {consoleLog} from '../utils';

export const GenerateTitleImageTest = () => {
    const imgRef = useRef<HTMLImageElement | null>(null);
    const handleGenerate = async () => {
        if (!imgRef.current) {
            return;
        }
        const canvas = await generateVideoTitleImage('Hello, world', Format.InstagramPost);
        consoleLog('canvas WxH', canvas.width, canvas.height);
        const dataurl = canvas.toDataURL('image/png');
        imgRef.current.src = dataurl;
    };

    return (
        <div>
            GenerateTitleImageTest
            <button onClick={handleGenerate}>Generate</button>
            <div>
                <img ref={imgRef}/>
            </div>
        </div>
    )
};
