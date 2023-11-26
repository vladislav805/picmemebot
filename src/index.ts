import { Bot, InlineQueryManager } from '@veluga/telegram';

import { messageRouter } from './actions/messageRouter';
import { moderatorIds } from './config';
import { BotError, getErrorDescription } from './errors';
import type { IContext } from './typings/IContext';
import { renderResults } from './utils/renderResults';
import { Storage } from './utils/Storage';

const bot = new Bot({
    secret: process.env.BOT_SECRET as string,
});

const storage = new Storage(process.env.BOT_STORAGE_PATH as string);

const CACHE_TIME = 20;
const ITEMS_PER_PAGE = 50;

bot.use(new InlineQueryManager({
    async onInlineQuery({ offset, query, from }) {
        const text = query.trim();

        const currentOffset = Number(offset);

        const allResults = storage.find(text, from);

        const results = allResults.slice(currentOffset, ITEMS_PER_PAGE);

        const nextOffset = currentOffset + ITEMS_PER_PAGE < allResults.length
            ? currentOffset + ITEMS_PER_PAGE
            : undefined;

        return {
            is_personal: false,
            cache_time: CACHE_TIME,
            results: renderResults(results),
            next_offset: nextOffset !== undefined ? String(nextOffset) : undefined,
        };
    },

    onResultChosen(query) {
        storage.countClick(query.result_id);
    }
}));

bot.on('message', async message => {
    const context: IContext = { bot, from: message.from!, query: '', storage };

    try {
        await messageRouter(context, message);
    } catch (e) {
        let text: string = `Error: ${(e as Error).message}`;

        if (e instanceof BotError) {
            text = getErrorDescription(context, e);
        }

        bot.sendMessageUniversal(message, 'text', { text });
    }
});

bot.on('callback_query', query => {
    if (!moderatorIds.includes(query.from.id)) {
        return;
    }

    const [command, fileId] = (query.data ?? '').split('/');

    if (query.message === undefined) {
        return;
    }

    const chat_id = query.message.chat.id;
    const message_id = query.message.message_id;

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
console.log('Bot started');
