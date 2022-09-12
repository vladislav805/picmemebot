import { PHOTO_SIDE_SIZE_LOW_QUALITY } from '../config';
import type { I18nKey } from './I18nKey';

export const en: Record<I18nKey, string> = {
    start: `Hello! I am a meme bot. Start mentioning me in any chat (@picmemebot ...), start writing meme keywords and I will give you pictures.\nIf something is missing, drop me a picture here larger than ${PHOTO_SIDE_SIZE_LOW_QUALITY}px on the smaller side and write the keywords (one keyword - one line)`,
    error_no_photo_specified: 'No photo specified.',
    error_photo_low_quality: `Photo in low resolution. The minimum allowable size on the smallest side of the photo is ${PHOTO_SIDE_SIZE_LOW_QUALITY}px.`,
    error_no_specified_tags: 'No tags specified. In a message with a photo in the text, indicate the keywords (tags) by which this meme can be found. Each tag on a new line.',
};
