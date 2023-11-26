import type * as Telegram from '@veluga/telegram';
import type { IMediaInfo } from '../../typings/IMediaInfo';
import { getMaxPhotoSize } from '../getMaxPhotoSize';

/**
 * Возвращает информацию о медиа из сообщения
 *
 * @param message Сообщение из Telegram
 *
 * @returns Минимальная информация о медиа из сообщения
 */
export function getMediaInfoByMessage(message: Telegram.Message): IMediaInfo | undefined {
    if (message.photo !== undefined) {
        const { file_id, file_unique_id, width, height } = getMaxPhotoSize(message.photo);

        return {
            type: 'photo',
            fileId: file_id,
            fileUniqueId: file_unique_id,
            width,
            height,
        };
    }

    if (message.animation !== undefined) {
        const { file_id, file_unique_id, width, height } = message.animation;

        return {
            type: 'mpeg4_gif',
            fileId: file_id,
            fileUniqueId: file_unique_id,
            width,
            height,
        };
    }

    if (message.video !== undefined) {
        const { file_id, file_unique_id, width, height, duration } = message.video;

        return {
            type: 'video',
            fileId: file_id,
            fileUniqueId: file_unique_id,
            width,
            height,
            duration,
        };
    }

    return undefined;
}
