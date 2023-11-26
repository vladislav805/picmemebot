interface IMediaInfoBase {
    fileId: string;
    fileUniqueId: string;
    width: number;
    height: number;
}

export interface IMediaInfoPhoto extends IMediaInfoBase {
    type: 'photo';
}

export interface IMediaInfoGif extends IMediaInfoBase {
    type: 'mpeg4_gif';
}

export interface IMediaInfoVideo extends IMediaInfoBase {
    type: 'video';
    duration: number;
}

export type IMediaInfo =
    | IMediaInfoPhoto
    | IMediaInfoGif
    | IMediaInfoVideo
;
