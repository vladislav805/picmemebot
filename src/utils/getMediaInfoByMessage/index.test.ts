import type * as Telegram from '@veluga/telegram';
import { getMediaInfoByMessage } from '.';

describe('getMediaInfoByMessage', () => {
    it('return info about photo', () => {
        const message = {
            message_id: 1,
            photo: [
                { file_id: 'a600', file_unique_id: 'au600', width: 600, height: 300 },
                { file_id: 'a100', file_unique_id: 'au100', width: 100, height: 50 },
                { file_id: 'a400', file_unique_id: 'au400', width: 400, height: 200 },
            ],
        } as Telegram.Message;

        expect(getMediaInfoByMessage(message)).toEqual({
            type: 'photo',
            fileId: 'a600',
            fileUniqueId: 'au600',
            width: 600,
            height: 300,
        });
    });

    it('return info about gif', () => {
        const message = {
            message_id: 1,
            animation: {
                file_id: 'file_id',
                file_unique_id: 'file_unique_id',
                width: 600,
                height: 300,
            },
        } as Telegram.Message;

        expect(getMediaInfoByMessage(message)).toEqual({
            type: 'mpeg4_gif',
            fileId: 'file_id',
            fileUniqueId: 'file_unique_id',
            width: 600,
            height: 300,
        });
    });

    it('return undefined for message without media', () => {
        const message = {
            message_id: 1,
        } as Telegram.Message;

        expect(getMediaInfoByMessage(message)).toBeUndefined();
    });
});
