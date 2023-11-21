import { promises as fs } from 'fs';

import type * as Telegram from '@veluga/telegram';

import type { IMeme, IMemeAuthor } from '../../typings';
import { Storage, type IStorageContent } from '.';

const PATH = '/path/to/json';

class TestStorage extends Storage {
    protected override content: IStorageContent = {
        items: [],
    };

    public constructor() {
        super(PATH);
    }

    public getContent() {
        return this.content;
    }

    public setContent(content: IStorageContent) {
        this.content = content;
        return this;
    }
}

jest.mock('fs', () => ({
    promises: {
        readFile: jest.fn().mockResolvedValue('{"items":[]}'),
        writeFile: jest.fn().mockResolvedValue(void 0),
    },
}));

describe('Storage', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('construct', () => {
        it('should read json file if it exists', async() => {
            (fs.readFile as jest.Mock).mockResolvedValue('{"items":[{"id":"a"}]}');

            const instance = new TestStorage();

            await new Promise(resolve => setTimeout(resolve, 0));

            expect(fs.readFile).toHaveBeenCalledWith(PATH, { encoding: 'utf-8' });
            expect(instance.getContent()).toEqual({
                items: [{ id: 'a' }],
            })
        });

        // it('should crash if json from file is invalid', async() => {
        //     (fs.readFile as jest.Mock).mockResolvedValue('{""""}');

        //     let storage: TestStorage;
        //     expect(async() => {
        //         storage = new TestStorage();

        //         await new Promise(resolve => setTimeout(resolve, 100));
        //     }).rejects.toThrow();

        //     expect(fs.readFile).toHaveBeenCalled();
        // });

        it('should not crash when json file is not exists', async() => {
            (fs.readFile as jest.Mock).mockRejectedValueOnce(new Error());

            const storage = new TestStorage();

            // reload в constructor'е асинхронный
            await new Promise(resolve => setTimeout(resolve, 10));

            expect(fs.readFile).toHaveBeenCalled();
            expect(storage.getContent().items.length).toEqual(0);
        });
    });

    describe('save', () => {
        let instance: TestStorage;

        beforeEach(() => {
            instance = new TestStorage();
        });

        it('should write current content to json file', () => {
            instance.setContent({
                items: [
                    { id: 'a' } as IMeme,
                    { id: 'b' } as IMeme,
                ],
            });

            // @ts-ignore private
            instance.save();

            expect(fs.writeFile).toHaveBeenCalledWith(PATH, '{"items":[{"id":"a"},{"id":"b"}]}', { encoding: 'utf-8' });
        });
    });

    describe('insert', () => {
        it('should add item in items and save file', () => {
            const instance = new TestStorage();

            // @ts-expect-error private method
            const save = jest.spyOn(instance, 'save');

            const meme = { id: '123' } as IMeme;

            // @ts-expect-error private method
            instance.insert(meme);

            expect(save).toHaveBeenCalled();
            expect(instance.getContent().items).toEqual([meme]);
        });
    });

    describe('add', () => {
        it('should add meme', () => {
            const instance = new TestStorage();

            // @ts-expect-error private method
            const insertMock = jest.spyOn(instance, 'insert');

            jest.spyOn(instance, 'findMemeByUniqueFileId').mockReturnValue(undefined);

            const meme: IMeme = {
                id: 'abc',
                accepted: false,
                date: 123,
                file: 'file_id',
                fileUnique: 'file_unique_id',
                tags: [
                    'tag1',
                    'tag2',
                ],
                type: 'photo',
                author: {
                    id: 777,
                    name: 'name',
                    username: 'username'
                },
                clicks: 0,
            };

            expect(instance.add(meme)).toBeTruthy();
            expect(instance.getContent().items).toEqual([meme]);
            expect(insertMock).toHaveBeenCalled();
        });

        it('should not add meme if already exist with same fileId', () => {
            const instance = new TestStorage();

            const DUP_ID = 'asdfgert';

            // @ts-expect-error private method
            const insertMock = jest.spyOn(instance, 'insert');

            jest.spyOn(instance, 'findMemeByUniqueFileId').mockReturnValue({ id: 'abc' } as IMeme);

            const meme: IMeme = {
                id: 'abc',
                accepted: false,
                date: 123,
                file: 'file_id',
                fileUnique: DUP_ID,
                tags: [
                    'tag1',
                    'tag2',
                ],
                type: 'photo',
                author: {
                    id: 777,
                    name: 'name',
                    username: 'username'
                },
                clicks: 0,
            };

            expect(instance.add(meme)).toBeFalsy();
            expect(insertMock).not.toHaveBeenCalled();
        });
    });

    describe('edit', () => {
        it('should change tags in existing meme', () => {
            const templateMeme: IMeme = {
                id: 'abcdef',
                accepted: false,
                date: 123,
                file: 'file_id',
                fileUnique: 'file_unique_id',
                tags: [
                    'tag1',
                    'tag2',
                ],
                type: 'photo',
                author: {
                    id: 777,
                    name: 'name',
                    username: 'username'
                },
                clicks: 0,
            };

            const instance = new TestStorage();

            // @ts-expect-error private method
            const saveMock = jest.spyOn(instance, 'save').mockResolvedValue(true);

            instance.setContent({
                items: [
                    { ...templateMeme, id: 'qwerty' },
                    templateMeme,
                    { ...templateMeme, id: 'asdfgh' },
                ],
            });

            expect(instance.edit(templateMeme, ['test1', 'test2', 'test3'])).toBeTruthy();
            expect(instance.getContent().items[1].tags).toEqual(['test1', 'test2', 'test3']);
            expect(saveMock).toHaveBeenCalled();
        });

        it('should do nothing if meme not exists', () => {
            const templateMeme: IMeme = {
                id: 'abcdef',
                accepted: false,
                date: 123,
                file: 'file_id',
                fileUnique: 'file_unique_id',
                tags: [
                    'tag1',
                    'tag2',
                ],
                type: 'photo',
                author: {
                    id: 777,
                    name: 'name',
                    username: 'username'
                },
                clicks: 0,
            };

            const instance = new TestStorage();

            // @ts-expect-error private method
            const saveMock = jest.spyOn(instance, 'save').mockResolvedValue(true);

            const items = [
                { ...templateMeme, id: 'qwerty' },
                { ...templateMeme, id: 'asdfgh' },
            ];

            instance.setContent({ items });

            expect(instance.edit(templateMeme, ['test1', 'test2', 'test3'])).toBeFalsy();
            expect(instance.getContent().items).toEqual(items);
            expect(saveMock).not.toHaveBeenCalled();
        });
    });

    describe('findMemeByUniqueFileId', () => {
        const items = [
            { fileUnique: '123456' } as IMeme,
            { fileUnique: 'abcdef' } as IMeme,
        ];

        it('should return meme by fileUnique', () => {
            const instance = new TestStorage();
            instance.setContent({ items });

            expect(instance.findMemeByUniqueFileId('abcdef')).toBe(items[1]);
        });

        it('should return undefined if not found', () => {
            const instance = new TestStorage();
            instance.setContent({ items });

            expect(instance.findMemeByUniqueFileId('aaaaaa')).toBeUndefined();
        });
    });

    describe('findMemeByInternalId', () => {
        const items = [
            { id: '123456' } as IMeme,
            { id: 'abcdef' } as IMeme,
        ];

        it('should return meme by fileUnique', () => {
            const instance = new TestStorage();
            instance.setContent({ items });

            expect(instance.findMemeByInternalId('abcdef')).toBe(items[1]);
        });

        it('should return undefined if not found', () => {
            const instance = new TestStorage();
            instance.setContent({ items });

            expect(instance.findMemeByInternalId('aaaaaa')).toBeUndefined();
        });
    });

    describe('accept', () => {
        const items = [
            { id: '123456', accepted: false } as IMeme,
            { id: 'abcdef', accepted: false } as IMeme,
            { id: 'qwerty', accepted: true } as IMeme,
        ];

        it('should set meme as accepted', () => {
            const instance = new TestStorage();
            instance.setContent({ items: structuredClone(items) });

            // @ts-expect-error private method
            const saveMock = jest.spyOn(instance, 'save');

            instance.accept(items[1].id);

            const res = instance.getContent().items;
            expect(res[0].accepted).toEqual(false);
            expect(res[1].accepted).toEqual(true);
            expect(res[2].accepted).toEqual(true);
            expect(saveMock).toHaveBeenCalled();
        });

        it('should do nothing if meme not found', () => {
            const instance = new TestStorage();
            instance.setContent({ items: structuredClone(items) });

            // @ts-expect-error private method
            const saveMock = jest.spyOn(instance, 'save');

            instance.accept('aaaaa');

            const res = instance.getContent().items;
            expect(res[0].accepted).toEqual(false);
            expect(res[1].accepted).toEqual(false);
            expect(res[2].accepted).toEqual(true);
            expect(saveMock).not.toHaveBeenCalled();
        });
    });

    describe('decline', () => {
        const items = [
            { id: '123456', accepted: false } as IMeme,
            { id: 'abcdef', accepted: false } as IMeme,
            { id: 'qwerty', accepted: true } as IMeme,
        ];

        it('should remove meme', () => {
            const instance = new TestStorage();
            instance.setContent({ items: structuredClone(items) });

            // @ts-expect-error private method
            const saveMock = jest.spyOn(instance, 'save');

            instance.decline(items[1].id);

            const res = instance.getContent().items;
            expect(res.length).toEqual(items.length - 1);
            expect(res[0]).toEqual(items[0]);
            expect(res[1]).toEqual(items[2]);
            expect(res[2]).toEqual(undefined);
            expect(saveMock).toHaveBeenCalled();
        });

        it('should do nothing if meme not found', () => {
            const instance = new TestStorage();
            instance.setContent({ items: structuredClone(items) });

            // @ts-expect-error private method
            const saveMock = jest.spyOn(instance, 'save');

            instance.decline('aaaaa');

            const res = instance.getContent().items;
            expect(res).toEqual(items);
            expect(saveMock).not.toHaveBeenCalled();
        });
    });

    describe('find', () => {
        const durov = { id: 1 } as IMemeAuthor;
        const anton = { id: 2 } as IMemeAuthor;
        const kirill = { id: 3 } as IMemeAuthor;
        const me = { id: 4 } as IMemeAuthor;

        const meTelegram = { id: 4 } as Telegram.User;

        const b = {} as IMeme;

        const dog = { ...b, id: 'dog', author: durov, tags: ['собака', 'смотрит'], accepted: false, clicks: 4 };
        const cat = { ...b, id: 'cat', author: me, tags: ['кот', 'курит'], accepted: true, clicks: 5 };
        const rosbiynik = { ...b, id: 'rozbiynik', author: kirill, tags: ['зеленский', 'выйди', 'розбiйник'], accepted: true, clicks: 9 };
        const obama = { ...b, id: 'obama', author: anton, tags: ['обэма', 'блэт', 'зеленый'], accepted: true, clicks: 1 };
        const kazino = { ...b, id: 'kazino', author: me, tags: ['рот', 'казино', 'блять'], accepted: true, clicks: 8 };
        const pepe = { ...b, id: 'pepe', author: anton, tags: ['пепе', 'pepe'], accepted: true };
        const yaz = { ...b, id: 'yaz', author: me, tags: ['язь', 'здаравенный', 'рыба', 'мечты'], accepted: false };

        const items: IMeme[] = [dog, cat, rosbiynik, obama, kazino, pepe, yaz];

        let instance: TestStorage;

        beforeEach(async() => {
            instance = new TestStorage();

            await new Promise(resolve => setTimeout(resolve, 10));

            instance.setContent({ items });
        });

        it('should return empty result', () => {
            expect(instance.find('test', meTelegram)).toEqual([]);
        });

        it('should return result for one word', () => {
            expect(instance.find('кот', meTelegram)).toEqual([cat]);
        });

        it('should return result for two words', () => {
            expect(instance.find('зел', meTelegram)).toEqual([rosbiynik, obama]);
        });

        it('should return result with filter out accepted=false, own=false', () => {
            expect(instance.find('ит', meTelegram)).toEqual([cat]); // -dog
        });

        it('should return result with filter out accepted=false, own=true', () => {
            expect(instance.find('язь', meTelegram)).toEqual([yaz]);
        });

        it('should return result with filter out', () => {
            expect(instance.find('т', meTelegram)).toEqual([kazino, cat, obama, yaz]); // -dog +yaz
        });
    });

    describe('countClick', () => {
        it('should increment clicks (clicks exists)', () => {
            const meme = {
                id: 'abcdef',
                clicks: 5,
            } as IMeme;

            const instance = new TestStorage();

            jest.spyOn(instance, 'findMemeByInternalId').mockReturnValue(meme);
            // @ts-expect-error private method
            const saveMock = jest.spyOn(instance, 'save');

            instance.countClick(meme.id);

            expect(meme.clicks).toEqual(6);
            expect(saveMock).toHaveBeenCalled();
        });

        it('should increment clicks (clicks is undefined)', () => {
            const meme = {
                id: 'abcdef',
            } as IMeme;

            const instance = new TestStorage();

            jest.spyOn(instance, 'findMemeByInternalId').mockReturnValue(meme);
            // @ts-expect-error private method
            const saveMock = jest.spyOn(instance, 'save');

            instance.countClick(meme.id);

            expect(meme.clicks).toEqual(1);
            expect(saveMock).toHaveBeenCalled();
        });

        it('should increment clicks (clicks exists)', () => {
            const meme = {
                id: 'abcdef',
                clicks: 5,
            } as IMeme;

            const instance = new TestStorage();

            jest.spyOn(instance, 'findMemeByInternalId').mockReturnValue(undefined);
            // @ts-expect-error private method
            const saveMock = jest.spyOn(instance, 'save');

            instance.countClick('qqqqqq');

            expect(meme.clicks).toEqual(5);
            expect(saveMock).not.toHaveBeenCalled();
        });
    });
});
