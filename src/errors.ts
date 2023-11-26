import { i18n } from './i18n';
import type { IContext } from './typings/IContext';

export class BotError extends Error {
    public constructor(
        public readonly reason: symbol,
        public readonly more?: string,
    ) {
        super();
    }

    public override toString() {
        return `${this.reason.description}: ${this.more}`;
    }
}

export const ERROR_NO_MEDIA_SPECIFIED = Symbol('NoMediaSpecified');
export const ERROR_ACCEPT_ONLY_PRIVATE_CHAT = Symbol('AcceptOnlyPrivateChat');
export const ERROR_MEDIA_LOW_QUALITY = Symbol('MediaLowQuality')
export const ERROR_NOT_ENOUGH_TAGS = Symbol('NotEnoughTags');
export const ERROR_NOT_MEME_NOT_FOUND = Symbol('MemeNotFound');
export const ERROR_MEME_NOT_YOURS = Symbol('MemeNotYours');

const descriptions: Record<symbol, (context: IContext) => string> = {
    [ERROR_NO_MEDIA_SPECIFIED]: context => i18n(context, 'error_no_media_specified'),
    [ERROR_ACCEPT_ONLY_PRIVATE_CHAT]: context => 'AcceptOnlyPrivateChat',
    [ERROR_MEDIA_LOW_QUALITY]: context => i18n(context, 'error_media_low_quality'),
    [ERROR_NOT_ENOUGH_TAGS]: context => i18n(context, 'error_no_specified_tags'),
    [ERROR_NOT_MEME_NOT_FOUND]: context => i18n(context, 'error_meme_not_found'),
};

export function getErrorDescription(context: IContext, error: BotError): string {
    const renderer = descriptions[error.reason];

    return renderer ? renderer(context) : `Error: ${error.reason.description}${error.more ? `, ${error.more}` : ''}`
}
