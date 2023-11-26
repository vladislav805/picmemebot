import { BOT_USERNAME, PHOTO_SIDE_SIZE_LOW_QUALITY } from '../config';
import type { I18nKey } from './I18nKey';

export const ru: Record<I18nKey, string> = {
    start: `Привет! Я - бот с мемами. Начни меня упоминать в любом чате (@${BOT_USERNAME} ...) и затем набирать ключевые слова мема, а я выдам тебе подходящие картинки, GIF'ки и видео.\nЕсли чего-то нет - сбрось сюда картинку, GIF'ку или видео размером более ${PHOTO_SIDE_SIZE_LOW_QUALITY}px по меньшей стороне и напиши ключевые слова (одно ключевое слово - одна строка)`,
    error_no_media_specified: 'Не передано фото/GIF/видео.',
    error_media_low_quality: `Фотография/GIF/видео в низком разрешении. Минимально допустимый размер по наименьшей стороне - ${PHOTO_SIDE_SIZE_LOW_QUALITY}px.`,
    error_no_specified_tags: 'Не указаны теги. В сообщении с фотографией/GIF/видео в тексте укажите ключевые слова (теги), по которым можно будет найти этот мем. Каждый тег на новой строке.',
    error_meme_not_found: 'Такой мем не найден',
    successfully_added: 'Мем добавлен. Сначала он доступен только тебе, но после проверки будет доступен всем.',
    edit_meme_text: 'Ответом на это сообщение отправь теги, которые считаешь нужными. Ниже приведены текущие теги.',
    successfully_saved: 'Теги успешно обновлены',
    error_unknown: 'Что-то пошло не так...',
};

export const en: Record<I18nKey, string> = {
    start: `Hello! I am a meme bot. Start mentioning me in any chat (@${BOT_USERNAME} ...), start writing meme keywords and I will give you pictures, GIFs and videos.\nIf something is missing, drop a picture, GIF or video here larger than ${PHOTO_SIDE_SIZE_LOW_QUALITY}px on the smaller side and write the keywords (one keyword - one line)`,
    error_no_media_specified: 'No photo/GIF/video is specified.',
    error_media_low_quality: `Media in low resolution. The minimum allowable size on the smallest side of the media is ${PHOTO_SIDE_SIZE_LOW_QUALITY}px.`,
    error_no_specified_tags: 'No tags specified. In a message with a photo/GIF/video in the text write the keywords (tags) by which this meme can be found. Each tag on a new line.',
    error_meme_not_found: 'No such meme found',
    successfully_added: 'Meme added. At first it is available only to you, but after verification it will be available to everyone.',
    edit_meme_text: 'Reply to this message by sending the tags that you consider necessary. Below are the current tags.',
    successfully_saved: 'Tags updated successfully',
    error_unknown: 'Something went wrong...',
};

export const uk: Record<I18nKey, string> = {
    start: `Здоровенькі були! Я - бот з мемами. Почни мене згадувати в будь-якому чаті (@${BOT_USERNAME}), а потім набери ключові слова мему, а я видам тобі відповідні картинки, GIF'ки та відео. Якщо чогось немає - скидай мені сюди картинки, GIF'ки чи відео розміром більше за ${PHOTO_SIDE_SIZE_LOW_QUALITY}px по найменшій стороні і напиши ключові слова (одне ключове слово - один рядок)`,
    error_no_media_specified: 'Не передано медіа',
    error_media_low_quality: `Фотографія/GIF/відео в низькій роздільній здатності в низькій роздільній здатності. Мінімально допустимий розмір по найменшій стороні - ${PHOTO_SIDE_SIZE_LOW_QUALITY}px`,
    error_no_specified_tags: 'Не вказано тегів. У повідомленні з медiа в тексті вкажіть ключові слова (теги), за якими можна знайти це мем. Кожен тег на новому рядку.',
    error_meme_not_found: 'Такий мем не знайдено',
    successfully_added: 'Мем додано. Спочатку він доступний лише тобі, але після перевірки буде доступний усім.',
    edit_meme_text: 'Відповіддю на це повідомлення відправте теги, які вважаєш за потрібне. Нижче наведено поточні теги.',
    successfully_saved: 'Теги успішно оновленi',
    error_unknown: 'Щось пішло не так...',
};
