import {describe, test, expect} from '@jest/globals';
import {reduceWideLines} from './utils';

const getTextWidth = (text: string) => text.length;

describe('parse multiline string', () => {
    test('1 short line should remain 1 line', () => {
        const text = 'hello';
        const lines = [...reduceWideLines(getTextWidth, text, 10)];
        const expectedResult = ['hello'];

        expect(lines).toEqual(expectedResult);
    });
    test('1 short line should remain 1 line', () => {
        const text = 'You decide to search for the\nnew job';
        const lines = [...reduceWideLines(getTextWidth, text, 10)];
        const expectedResult = ['You decide', 'to search', 'for the', 'new job'];

        expect(lines).toEqual(expectedResult);
    });
});
