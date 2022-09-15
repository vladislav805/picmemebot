import { Bot, InlineQueryManager, InlineQueryResult, User } from '@veluga/telegram';

import { addMeme } from './actions/addMeme';
import { moderatorIds } from './config';
import { BotError, getErrorDescription } from './errors';
import { i18n } from './i18n';
import type { IContext } from './typings/context';
import { Storage } from './utils/storage';

const bot = new Bot({
    secret: process.env.BOT_SECRET as string,
});

const storage = new Storage('test.json');

function createContext({ from, query = '' }: { from: User; query?: string }): IContext {
    return { bot, from, query, storage };
}

bot.use(new InlineQueryManager({
    async onInlineQuery({ id, offset, query, from }) {
        const text = query.trim();

        if (!text) {
            return {
                results: [],
            };
        }

        const results = storage.find(text, from).map(item => ({
            type: 'photo',
            id: item.id,
            photo_file_id: item.file,
        }) as InlineQueryResult);

        return {
            is_personal: false,
            cache_time: 30,
            results,
        };
    },
}));

bot.on('message', async message => {
    if (message.forward_from) return;

    const context: IContext = createContext({ from: message.from! });

    if (message.text === '/start') {
        bot.sendMessageUniversal(message, 'text', { text: i18n(context, 'start') });
        return;
    }

    if (message.photo) {
        try {
            if (await addMeme(context, message)) {
                bot.sendMessageUniversal(message, 'text', { text: i18n(context, 'successfully_added') });
            }
        } catch (e) {
            let text: string = `Error: ${(e as Error).message}`;

            if (e instanceof BotError) {
                text = getErrorDescription(context, e);
            }

            bot.sendMessageUniversal(message, 'text', { text });
        }
    }
});

bot.on('callback_query', query => {
    if (!moderatorIds.includes(query.from.id)) return;

    const [command, fileId] = (query.data ?? '').split('/');

    const chat_id = query.message!.chat.id;
    const message_id = query.message!.message_id

    switch (command) {
        case 'accept': {
            storage.accept(fileId);
            bot.client.deleteMessage({ chat_id, message_id });
            break;
        }

        case 'decline': {
            storage.decline(fileId);
            bot.client.deleteMessage({ chat_id, message_id });
            break;
        }
    }
});

bot.startPolling();