import type { I18nKey } from './I18nKey';
import type { LocaleKey } from './LocaleKey';

import { ru } from './ru';
import { en } from './en';
import { uk } from './uk';
import type { IContext } from '../typings/context';

const data: Record<LocaleKey, Record<I18nKey, string>> = { ru, en, uk };

export function i18nFactory(locale: LocaleKey | undefined = 'en'): (key: I18nKey) => string {
    return key => data[locale][key];
}

export function i18n(context: IContext, key: I18nKey): string {
    const source = data[context.from.language_code as LocaleKey] ?? data.en;
    return source[key];
}
