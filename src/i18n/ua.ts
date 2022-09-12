import { PHOTO_SIDE_SIZE_LOW_QUALITY } from '../config';
import type { I18nKey } from './I18nKey';

export const ua: Record<I18nKey, string> = {
    start: `Привет! Я - бот з мемами. Начні мене згадати в будь-якому чате (@picmemebot ...), начні написати ключові слова мемами і я видам вам картинки.\nЯкщо чого-то немає - скиньте мені сюди картинку розміром більше ${PHOTO_SIDE_SIZE_LOW_QUALITY}px на меншу сторону і напишіть ключове слово (одно ключове слово - одна строка)`,
    error_no_photo_specified: 'Не передано фото',
    error_photo_low_quality: `Фото поганої якості.  Минимально допустимый размер по наименьшей стороне фотографии - ${PHOTO_SIDE_SIZE_LOW_QUALITY}px.`,
    error_no_specified_tags: 'Не вказано тегів. У повідомленні з фотографією в тексті вкажіть ключові слова (теги), за якими можна знайти це мем. Кожен тег на новому рядку.',
};
