import * as fs from 'fs';
import * as path from 'path';
import type { User } from '@veluga/telegram';

import type { IMeme } from '../typings/meme';

export interface IStorageContent {
    items: IMeme[];
}

export class Storage {
    protected readonly path: string;
    protected _content: IStorageContent | undefined;

    public constructor(_path: string) {
        this.path = path.resolve(_path);
        this.reload();
    }

    protected reload(): IStorageContent {
        if (!fs.existsSync(this.path)) {
            fs.writeFileSync(this.path, '{"items":[]}', { encoding: 'utf-8' });
        }

        return this._content = JSON.parse(fs.readFileSync(this.path, { encoding: 'utf-8' }));
    }

    protected get content(): IStorageContent {
        return this._content as IStorageContent;
    }

    protected save() {
        fs.writeFileSync(this.path, JSON.stringify(this.content, null, 4));
        this.reload();
    }

    public add(meme: IMeme): boolean {
        const isDuplicate = this.content.items.find(item => item.file === meme.file);

        if (isDuplicate) return false;

        this.content.items.push(meme);
        this.save();
        return true;
    }

    public accept(id: string) {
        const meme = this.content.items.find(meme => meme.id === id);

        if (meme) {
            meme.accepted = true;
        }

        this.save();
    }

    public decline(id: string) {
        this.content.items = this.content.items.filter(meme => meme.id !== id);

        this.save();
    }

    public find(query: string, from: User): IMeme[] {
        const result: Set<IMeme> = new Set<IMeme>();

        const words = query.split(' ');

        for (const meme of this.content.items) {
            if (!meme.accepted && meme.author.id !== from.id) continue;

            for (const word of words) {
                for (const tag of meme.tags) {
                    if (tag.includes(word)) {
                        result.add(meme);
                    }
                }
            }
        }

        return [...result];
    }
}
