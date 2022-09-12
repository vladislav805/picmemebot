import { moderatorIds } from '../config';
import type { IContext } from '../typings/context';
import type { IMeme } from '../typings/meme';

export async function sendAcceptation(context: IContext, meme: IMeme): Promise<void> {
    context.bot.client.sendPhoto({
        chat_id: moderatorIds[0],
        photo: meme.file,
        caption: `<b>Author</b>: @${meme.author.username} (${meme.author.name})\n<b>Tags</b>:\n${meme.tags.join('\n')}`,
        parse_mode: 'HTML',
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: 'Accept',
                        callback_data: `accept/${meme.id}`,
                    },
                    {
                        text: 'Decline',
                        callback_data: `decline/${meme.id}`,
                    },
                ],
            ],
        },
    });
}
