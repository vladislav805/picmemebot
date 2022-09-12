import { moderatorIds } from '../config';
import type { IContext } from '../typings/context';
import type { IMeme } from '../typings/meme';
import { md5 } from '../utils/md5';
import { sendAcceptation } from './acceptation';

export async function saveMeme(context: IContext, file: string, tags: string[]): Promise<boolean> {
    const isModerator = moderatorIds.includes(context.from.id);

    const id = md5(file);

    const meme: IMeme = {
        id,
        tags,
        file,
        accepted: isModerator,
        author: {
            id: context.from.id,
            username: context.from.username,
            name: context.from.first_name,
        },
        date: Date.now(),
    };

    context.storage.add(meme);

    if (!isModerator) {
        sendAcceptation(context, meme);
    }

    return true;
}
