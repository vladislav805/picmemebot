import type { Message } from '@veluga/telegram';
import { PHOTO_SIDE_SIZE_LOW_QUALITY } from '../config';
import {
    BotError,
    ERROR_ACCEPT_ONLY_PRIVATE_CHAT,
    ERROR_NOT_ENOUGH_TAGS,
    ERROR_PHOTO_LOW_QUALITY,
} from '../errors';
import type { IContext } from '../typings/context';
import type { MemeType } from '../typings/meme';
import { getMaxPhotoSize } from '../utils/getMaxPhotoSize';
import { saveMeme } from './saveMeme';

export async function addMeme(context: IContext, message: Message): Promise<boolean> {
    const { photo, animation, chat, caption } = message;

    // Принимаем пикчи только в личных сообщениях с ботом
    if (chat.type !== 'private') throw new BotError(ERROR_ACCEPT_ONLY_PRIVATE_CHAT);

    let type: MemeType | undefined = undefined;
    let fileId: string | undefined = undefined;
    let minSideSize: number | undefined = undefined;

    const tags = (caption ?? '').trim().toLowerCase().split('\n').map(line => line.trim()).filter(Boolean);

    if (tags.length === 0) throw new BotError(ERROR_NOT_ENOUGH_TAGS);

    if (photo !== undefined) {
        const maxSize = getMaxPhotoSize(photo ?? animation?.thumb);

        minSideSize = Math.min(maxSize.width, maxSize.height);
        type = 'photo';
        fileId = maxSize.file_id;

        if (minSideSize === undefined || minSideSize < PHOTO_SIDE_SIZE_LOW_QUALITY) {
            throw new BotError(ERROR_PHOTO_LOW_QUALITY);
        }
    } else if (animation !== undefined) {
        minSideSize = Math.min(animation.width, animation.height);
        type = 'mpeg4_gif';
        fileId = animation.file_id;
    }

    if (type === undefined || fileId === undefined) {
        return false;
    }

    return saveMeme(context, type, fileId, tags);
}
