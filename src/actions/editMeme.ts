import type * as Telegram from '@veluga/telegram';

import { BotError, ERROR_MEME_NOT_YOURS, ERROR_NOT_ENOUGH_TAGS, ERROR_NOT_MEME_NOT_FOUND } from '../errors';
import type { IContext } from '../typings';
import { parseTags } from '../utils/parseTags';
import { moderatorIds } from '../config';
import { i18n } from '../i18n';

export async function editMeme(
    context: IContext,
    message: Telegram.Message,
): Promise<void> {
    // мессага точно есть, она гарантировано от нашего бота
    const replyMsg = message.reply_to_message as Telegram.Message;

    const fileUniqueIdEntity = replyMsg.entities?.find(entity => entity.type === 'code');

    if (fileUniqueIdEntity === undefined) {
        return;
    }

    const fileUniqueId = (replyMsg.text ?? '').slice(
        fileUniqueIdEntity.offset,
        fileUniqueIdEntity.offset + fileUniqueIdEntity.length,
    );

    if (fileUniqueId === undefined) {
        return;
    }

    const meme = context.storage.findMemeByInternalId(fileUniqueId);

    if (meme === undefined) {
        throw new BotError(ERROR_NOT_MEME_NOT_FOUND);
    }

    if (meme.author.id !== context.from.id && !moderatorIds.includes(context.from.id)) {
        throw new BotError(ERROR_MEME_NOT_YOURS);
    }

    const tags = parseTags(message.text);

    if (tags.length === 0) {
        throw new BotError(ERROR_NOT_ENOUGH_TAGS);
    }

    const result = context.storage.edit(meme, tags);

    const text = i18n(context, result ? 'successfully_saved' : 'error_unknown');

    await context.bot.sendMessageUniversal(message, 'text', { text, reply_markup: { remove_keyboard: true } });
}
