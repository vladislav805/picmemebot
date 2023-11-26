import type * as Telegram from '@veluga/telegram';

import { BOT_USERNAME } from '../config';
import { i18n } from '../i18n';
import type { IContext } from '../typings';
import { addMeme } from './addMeme';
import { editMeme } from './editMeme';
import { requestToEditMeme } from './requestToEditMeme';

export async function messageRouter(
    context: IContext,
    message: Telegram.Message,
): Promise<void> {
    // Любые пересланные игнорируем, поскольку в них нельзя менять текст
    if (message.forward_from !== undefined) {
        return;
    }

    if (message.text === '/start') {
        context.bot.sendMessageUniversal(message, 'text', {
            text: i18n(context, 'start'),
        });
        return;
    }

    // Сохранение мема (редактирование тегов)
    const replyMessage = message.reply_to_message;
    if (
        replyMessage !== undefined &&
        replyMessage.from?.username === BOT_USERNAME
    ) {
        return editMeme(context, message);
    }

    // Прислали фотографию, GIF или видео
    if (
        message.photo !== undefined ||
        message.animation !== undefined ||
        message.video !== undefined
    ) {
        // Прислано через бота?
        if (message.via_bot !== undefined) {
            // Через нашего бота?
            if (message.via_bot.username === BOT_USERNAME) {
                // Запрос на редактирование тегов
                await requestToEditMeme(context, message);
            }
            // Любого другого бота исключаем, нельзя вставить текст или текст будет мусорным
            return;
        }

        // Добавление нового мема
        await addMeme(context, message);
        context.bot.sendMessageUniversal(message, 'text', {
            text: i18n(context, 'successfully_added'),
        });
    }
}
