import type { PhotoSize } from '@veluga/telegram';

/**
 * Находит в массиве максимально большой размер из представленных
 * @param sizes Размеры фотографий (объект фотографии)
 * @returns Максимальный размер фотографии
 */
export function getMaxPhotoSize(sizes: PhotoSize[]): PhotoSize {
    return sizes.reduce((max, cur) => Math.max(max.width, max.height) < Math.max(cur.width, cur.height) ? cur : max);
}
