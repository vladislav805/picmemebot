

export interface IMeme {
    id: string;
    author: IMemeAuthor;
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