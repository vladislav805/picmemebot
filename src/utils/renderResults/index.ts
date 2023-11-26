import type { InlineQueryResult } from '@veluga/telegram';

import type { IMeme } from '../../typings/IMeme';

function renderItem(meme: IMeme): InlineQueryResult {
    switch (meme.type) {
        case 'photo': {
            return {
                type: 'photo',
                id: meme.id,
                photo_file_id: meme.file,
            };
        }

        case 'video':
        case 'mpeg4_gif': {
            return {
                type: 'mpeg4_gif',
                id: meme.id,
                mpeg4_file_id: meme.file,
            };
        }
    }
}

export function renderResults(results: IMeme[]): InlineQueryResult[] {
    return results.map(renderItem);
}
