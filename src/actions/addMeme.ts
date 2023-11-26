import type { Message } from '@veluga/telegram';
import { PHOTO_SIDE_SIZE_LOW_QUALITY } from '../config';
import {
    BotError,
    ERROR_ACCEPT_ONLY_PRIVATE_CHAT,
    ERROR_NOT_ENOUGH_TAGS,
    ERROR_MEDIA_LOW_QUALITY,
} from '../errors';
import type { IContext } from '../typings/IContext';
import { getMediaInfoByMessage } from '../utils/getMediaInfoByMessage';
import { parseTags } from '../utils/parseTags';
import { saveMeme } from './saveMeme';

export async function addMeme(
    context: IContext,
    message: Message,
): Promise<boolean> {
    // Принимаем пикчи только в личных сообщениях с ботом
    if (message.chat.type !== 'private') {
        throw new BotError(ERROR_ACCEPT_ONLY_PRIVATE_CHAT);
    }

    const tags = parseTags(message.caption);

    if (tags.length === 0) {
        throw new BotError(ERROR_NOT_ENOUGH_TAGS);
    }

    const info = getMediaInfoByMessage(message);

    // Не нашли медиа
    if (info === undefined) {
        return false;
    }

    // Изображения и видео проверяем на размер
    if (
        (info.type === 'photo' || info.type === 'video') &&
        Math.min(info.width, info.height) < PHOTO_SIDE_SIZE_LOW_QUALITY
    ) {
        throw new BotError(ERROR_MEDIA_LOW_QUALITY);
    }

    return saveMeme(context, info, tags);
}
