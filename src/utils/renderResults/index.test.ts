import { renderResults } from '.';
import type { IMeme } from '../../typings';

describe('renderResults', () => {
    it('returns Array<InlineQueryResult> by Array<IMeme>', () => {
        const items: IMeme[] = [
            { type: 'photo', id: 'abc', file: '123', fileUnique: '456', accepted: true } as IMeme,
            { type: 'mpeg4_gif', id: 'def', file: '789', fileUnique: '012', accepted: true } as IMeme,
        ];

        expect(renderResults(items)).toEqual([
            { type: 'photo', id: 'abc', photo_file_id: '123' },
            { type: 'mpeg4_gif', id: 'def', mpeg4_file_id: '789' },
        ]);
    });
});
