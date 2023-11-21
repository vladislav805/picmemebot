import { moderatorIds } from '../config';
import type { IContext } from '../typings/IContext';
import type { IMeme } from '../typings/IMeme';
import type { IMediaInfo } from '../typings/IMediaInfo';
import { md5 } from '../utils/md5';
import { sendAcceptation } from './acceptation';

export async function saveMeme(
    context: IContext,
    media: IMediaInfo,
    tags: readonly string[],
): Promise<boolean> {
    const isModerator = moderatorIds.includes(context.from.id);

    const id = md5(media.fileId);

    const meme: IMeme = {
        id,
        tags,
        type: media.type,
        file: media.fileId,
        fileUnique: media.fileUniqueId,
        accepted: isModerator,
        author: {
            id: context.from.id,
            username: context.from.username,
            name: context.from.first_name,
        },
        date: Date.now(),
        clicks: 0,
    };

    const result = context.storage.add(meme);

    if (result && !isModerator) {
        sendAcceptation(context, media.type, meme);
    }

    return result;
}
