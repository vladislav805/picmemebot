import { promises as fs } from 'fs';
import type * as Telegram from '@veluga/telegram';

import type { IMeme } from '../../typings';

export interface IStorageContent {
    items: IMeme[];
}

export class Storage {
    protected content!: IStorageContent;

    public constructor(
        protected readonly path: string,
    ) {
        this.reload();
    }

    protected async reload() {
        let fileContent: string;

        try {
            fileContent = await fs.readFile(this.path, {
                encoding: 'utf-8',
            });
        } catch (e: any) {
            fileContent = '{"items":[]}';
        }

        this.content = JSON.parse(fileContent);
    }

    protected async save() {
        await fs.writeFile(this.path, JSON.stringify(this.content), {
            encoding: 'utf-8',
        });
    }

    protected insert(meme: IMeme): void {
        this.content.items.push(meme);

        void this.save();
    }

    /**
     * Добавляет мем
     *
     * @param meme Мем
     */
    public add(meme: IMeme): boolean {
        const hasDuplicate = this.findMemeByUniqueFileId(meme.fileUnique);

        if (hasDuplicate !== undefined) {
            return false;
        }

        this.insert(meme);

        return true;
    }

    /**
     * Редактирует теги у мема
     *
     * @param meme Мем
     * @param tags Новые теги
     */
    public edit(meme: IMeme, tags: readonly string[]): boolean {
        const hasInContent = this.content.items.includes(meme);

        if (!hasInContent) {
            return false;
        }

        meme.tags = tags;
        void this.save();

        return true;
    }

    /**
     * Пытается найти уже добавленный мем по file_unique_id
     *
     * @param uniqueFileId Идентификатор файла Telegram
     */
    public findMemeByUniqueFileId(uniqueFileId: string): IMeme | undefined {
        return this.content.items.find(meme => meme.fileUnique === uniqueFileId);
    }

    /**
     * Пытается найти добавленный мем по внутреннему идентификатору
     *
     * @param internalId Внутренний идентификатор
     */
    public findMemeByInternalId(internalId: string): IMeme | undefined {
        return this.content.items.find(meme => meme.id === internalId);
    }

    /**
     * Одобрение мема для публичного использования
     *
     * @param internalId Внутренний идентификатор мема
     */
    public accept(internalId: string) {
        const meme = this.findMemeByInternalId(internalId);

        if (meme !== undefined) {
            meme.accepted = true;
            void this.save();
        }
    }

    /**
     * Удаляет мем по внутреннему идентификатору
     *
     * @param id Внутренний идентификатор мема
     */
    public decline(id: string) {
        const previousLength = this.content.items.length;

        this.content.items = this.content.items.filter(meme => meme.id !== id);

        if (previousLength !== this.content.items.length) {
            void this.save();
        }
    }

    public find(query: string, from: Telegram.User): IMeme[] {
        const result: Set<IMeme> = new Set<IMeme>();

        const words = query.split(' ');

        for (const meme of this.content.items) {
            if (!meme.accepted && meme.author.id !== from.id) {
                continue;
            }


            for (const word of words) {
                for (const tag of meme.tags) {
                    if (tag.includes(word)) {
                        result.add(meme);
                    }
                }
            }
        }

        return [...result].sort((a, b) => b.clicks - a.clicks);
    }

    public countClick(internalId: string) {
        const meme = this.findMemeByInternalId(internalId);

        if (meme === undefined) {
            return;
        }

        meme.clicks = (meme.clicks ?? 0) + 1;

        this.save();
    }
}
