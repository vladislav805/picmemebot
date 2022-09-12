import { i18n } from './i18n';
import type { IContext } from './typings/context';

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

export const ERROR_NO_PHOTO_SPECIFIED = Symbol('NoPhotoSpecified');
export const ERROR_ACCEPT_ONLY_PRIVATE_CHAT = Symbol('AcceptOnlyPrivateChat');
export const ERROR_PHOTO_LOW_QUALITY = Symbol('PhotoLowQuality')
export const ERROR_NOT_ENOUGH_TAGS = Symbol('NotEnoughTags');

const descriptions: Record<symbol, (context: IContext) => string> = {
    [ERROR_NO_PHOTO_SPECIFIED]: context => i18n(context, 'error_no_photo_specified'),
    [ERROR_ACCEPT_ONLY_PRIVATE_CHAT]: context => 'AcceptOnlyPrivateChat',
    [ERROR_PHOTO_LOW_QUALITY]: context => i18n(context, 'error_photo_low_quality'),
    [ERROR_NOT_ENOUGH_TAGS]: context => i18n(context, 'error_no_specified_tags'),
};

export function getErrorDescription(context: IContext, error: BotError): string {
    const renderer = descriptions[error.reason];

    return renderer ? renderer(context) : `Error: ${error.reason.description}${error.more ? `, ${error.more}` : ''}`
}
