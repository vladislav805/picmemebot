import type { Message } from '@veluga/telegram';
import { PHOTO_SIDE_SIZE_LOW_QUALITY } from '../config';
import {
    BotError,
    ERROR_ACCEPT_ONLY_PRIVATE_CHAT,
    ERROR_NOT_ENOUGH_TAGS,
    ERROR_NO_PHOTO_SPECIFIED,
    ERROR_PHOTO_LOW_QUALITY,
} from '../errors';
import type { IContext } from '../typings/context';
import { getMaxPhotoSize } from '../utils/getMaxPhotoSize';
import { saveMeme } from './saveMeme';

export async function addMeme(context: IContext, message: Message): Promise<boolean> {
    const { photo, chat, caption } = message;

    // Нет фото - нет мема
    if (!photo) throw new BotError(ERROR_NO_PHOTO_SPECIFIED);

    // Принимаем пикчи только в личных сообщениях с ботом
    if (chat.type !== 'private') throw new BotError(ERROR_ACCEPT_ONLY_PRIVATE_CHAT);

    const maxSize = getMaxPhotoSize(photo);

    const minSide = Math.min(maxSize.width, maxSize.height);

    if (minSide < PHOTO_SIDE_SIZE_LOW_QUALITY) throw new BotError(ERROR_PHOTO_LOW_QUALITY);

    const tags = (caption ?? '').trim().toLowerCase().split('\n').map(line => line.trim()).filter(Boolean);

    if (tags.length === 0) throw new BotError(ERROR_NOT_ENOUGH_TAGS);

    return saveMeme(context, maxSize.file_id, tags);
}
