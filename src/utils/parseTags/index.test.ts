import { parseTags } from '.';

describe('parseTags', () => {
    it('returns tags from string', () => {
        const actual = parseTags('  trimmed  \nDiFfeRent Case\n Trim \n\n');
        expect(actual).toEqual([
            'trimmed',
            'different',
            'case',
            'trim',
        ]);
    });

    it('returns empty array on undefined', () => {
        const actual = parseTags(undefined);
        expect(actual).toEqual([]);
    });
});
