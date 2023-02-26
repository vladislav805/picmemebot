export type MemeType = 'photo' | 'mpeg4_gif';

export interface IMeme {
    id: string;
    author: IMemeAuthor;
    type: MemeType;
    tags: string[];
    date: number;
    file: string;
    accepted: boolean;
}

export interface IMemeAuthor {
    id: number;
    username?: string;
    name?: string;
}
