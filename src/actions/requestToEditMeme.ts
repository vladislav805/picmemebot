import type * as Telegram from '@veluga/telegram';

import { BotError, ERROR_MEME_NOT_YOURS, ERROR_NOT_MEME_NOT_FOUND } from '../errors';
import { i18n } from '../i18n';
import type { IContext } from '../typings';
import { getMediaInfoByMessage } from '../utils/getMediaInfoByMessage';

/**
 * Запрос на редактирование сообщения
 */
export async function requestToEditMeme(
    context: IContext,
    message: Telegram.Message,
): Promise<void> {
    const media = getMediaInfoByMessage(message);

    if (media === undefined) {
        throw new BotError(ERROR_NOT_MEME_NOT_FOUND);
    }

    const meme = context.storage.findMemeByUniqueFileId(media.fileUniqueId);

    if (meme === undefined) {
        throw new BotError(ERROR_NOT_MEME_NOT_FOUND);
    }

    if (meme.author.id !== context.from.id) {
        throw new BotError(ERROR_MEME_NOT_YOURS);
    }

    const tags = meme.tags.join('\n').replace(/</gm, '&lt;');

    await context.bot.sendMessageUniversal(message, 'text', {
        text: `ID: <code>${meme.id}</code>\n${i18n(context, 'edit_meme_text')}<pre>${tags}</pre>`,
        reply_to_message_id: message.message_id,
        parse_mode: 'HTML',
        reply_markup: {
            force_reply: true,
        },
    });
}
