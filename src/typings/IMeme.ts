import type { IMemeAuthor } from './IMemeAuthor';

export type MemeType = 'photo' | 'mpeg4_gif' | 'video';

export interface IMeme {
    id: string;
    author: IMemeAuthor;
    type: MemeType;
    tags: readonly string[];
    date: number;
    file: string;
    fileUnique: string;
    duration?: number;
    accepted: boolean;
    clicks: number;
}


