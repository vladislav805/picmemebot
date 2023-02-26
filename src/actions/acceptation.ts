import { moderatorIds } from '../config';
import type { IContext } from '../typings/context';
import type { IMeme, MemeType } from '../typings/meme';

export async function sendAcceptation(context: IContext, type: MemeType, meme: IMeme): Promise<void> {
    const chat_id = moderatorIds[0];
    const caption = `<b>Author</b>: @${meme.author.username} (${meme.author.name})\n<b>Tags</b>:\n${meme.tags.join('\n')}`;
    const reply_markup = {
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
    };

    if (type === 'mpeg4_gif') {
        context.bot.client.sendAnimation({
            chat_id,
            animation: meme.file,
            caption,
            parse_mode: 'HTML',
            reply_markup,
        });
    } else {
        context.bot.client.sendPhoto({
            chat_id,
            photo: meme.file,
            caption,
            parse_mode: 'HTML',
            reply_markup,
        });
    }
}
