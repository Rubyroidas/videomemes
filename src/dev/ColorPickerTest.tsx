import {useState} from 'react';
import {GithubPicker} from 'react-color';

import {PREDEFINED_TEXT_COLORS} from '../config';
import {consoleLog} from '../utils';

export const ColorPickerTest = () => {
    const [color, setColor] = useState(PREDEFINED_TEXT_COLORS[0]);
    consoleLog(`color: ${color}`);

    return (
        <div>
            <GithubPicker
                color={color}
                colors={PREDEFINED_TEXT_COLORS}
                onChange={color => setColor(color.hex)}
            />
        </div>
    )
};
