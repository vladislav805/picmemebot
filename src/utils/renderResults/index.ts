import type { InlineQueryResult } from '@veluga/telegram';

import type { IMeme, MemeType } from '../../typings/IMeme';

const fileIdKey: Record<MemeType, string> = {
    photo: 'photo_file_id',
    mpeg4_gif: 'mpeg4_file_id',
};

export function renderResults(results: IMeme[]): InlineQueryResult[] {
    return results.map(item => ({
        type: item.type,
        id: item.id,
        [fileIdKey[item.type]]: item.file,
    }) as unknown as InlineQueryResult);
}
