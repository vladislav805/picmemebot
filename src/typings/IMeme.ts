import type { IMemeAuthor } from './IMemeAuthor';

export type MemeType = 'photo' | 'mpeg4_gif';

export interface IMeme {
    id: string;
    author: IMemeAuthor;
    type: MemeType;
    tags: readonly string[];
    date: number;
    file: string;
    fileUnique: string;
    accepted: boolean;
    clicks: number;
}


