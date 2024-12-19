import { describe, test, expect } from 'vitest';
import { dateTimeFormatter } from './formatters';

const cases = [
    // invalid dates
    ['', '-'],
    [' ', '-'],
    ['not a date', '-'],

    // valid dates
    ['2023-06-05T00:00:00Z', /^\d{2}\.\d{2}\.\d{2}, \d{2}:\d{2}:\d{2}$/],
];

describe("'dateTimeFormatter' utility", () => {
    test.each(cases)('given %p as argument, returns result that matches %p', (firstArg, expectedResult) => {
        const result = dateTimeFormatter(firstArg as string);
        if (typeof expectedResult === 'string') {
            expect(result).toEqual(expectedResult);
        } else {
            // if expectedResult is a regular expression, use toMatch
            expect(result).toMatch(expectedResult);
        }
    });
});
