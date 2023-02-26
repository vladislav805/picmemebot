import { moderatorIds } from '../config';
import type { IContext } from '../typings/context';
import type { IMeme, MemeType } from '../typings/meme';
import { md5 } from '../utils/md5';
import { sendAcceptation } from './acceptation';

export async function saveMeme(context: IContext, type: MemeType, file: string, tags: string[]): Promise<boolean> {
    const isModerator = moderatorIds.includes(context.from.id);

    const id = md5(file);

    const meme: IMeme = {
        id,
        tags,
        type,
        file,
        accepted: isModerator,
        author: {
            id: context.from.id,
            username: context.from.username,
            name: context.from.first_name,
        },
        date: Date.now(),
    };

    const result = context.storage.add(meme);

    if (result && !isModerator) {
        sendAcceptation(context, type, meme);
    }

    return result;
}
