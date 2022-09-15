import { PHOTO_SIDE_SIZE_LOW_QUALITY } from '../config';
import type { I18nKey } from './I18nKey';

export const ru: Record<I18nKey, string> = {
    start: `Привет! Я - бот с мемами. Начни меня упоминать в любом чате (@picmemebot ...) и затем набирать ключевые слова мема, а я выдам тебе подходящие картинки.\nЕсли чего-то нет - сбрось мне сюда картинку размером более ${PHOTO_SIDE_SIZE_LOW_QUALITY}px по меньшей стороне и напиши ключевые слова (одно ключевое слово - одна строка)`,
    error_no_photo_specified: 'Не передано фото.',
    error_photo_low_quality: `Фотография в низком разрешении. Минимально допустимый размер по наименьшей стороне фотографии - ${PHOTO_SIDE_SIZE_LOW_QUALITY}px.`,
    error_no_specified_tags: 'Не указаны теги. В сообщении с фотографией в тексте укажите ключевые слова (теги), по которым можно будет найти этот мем. Каждый тег на новой строке.',
    successfully_added: 'Мем добавлен. Сначала он доступен только тебе, но после проверки будет доступен всем.',
};