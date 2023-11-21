import type { PhotoSize } from '@veluga/telegram';
import { getMaxPhotoSize } from '.';

describe('getMaxPhotoSize', () => {
    it('returns PhotoSize with max size (vertical)', () => {
        const aspect = 1.5;
        const sizes: PhotoSize[] = [
            { file_id: 'a', file_unique_id: 'a', width: 100, height: 100 * aspect },
            { file_id: 'a', file_unique_id: 'a', width: 800, height: 800 * aspect },
            { file_id: 'a', file_unique_id: 'a', width: 400, height: 400 * aspect },
        ];
        expect(getMaxPhotoSize(sizes)).toEqual(sizes[1]);
    });

    it('returns PhotoSize with max size (horizontal)', () => {
        const aspect = 1.5;
        const sizes: PhotoSize[] = [
            { file_id: 'a', file_unique_id: 'a', width: 100 * aspect, height: 100 },
            { file_id: 'a', file_unique_id: 'a', width: 800 * aspect, height: 800 },
            { file_id: 'a', file_unique_id: 'a', width: 400 * aspect, height: 400 },
        ];
        expect(getMaxPhotoSize(sizes)).toEqual(sizes[1]);
    });

    it('returns PhotoSize with max size (square)', () => {
        const sizes: PhotoSize[] = [
            { file_id: 'a', file_unique_id: 'a', width: 100, height: 100 },
            { file_id: 'a', file_unique_id: 'a', width: 800, height: 800 },
            { file_id: 'a', file_unique_id: 'a', width: 400, height: 400 },
        ];
        expect(getMaxPhotoSize(sizes)).toEqual(sizes[1]);
    });

    it('returns PhotoSize with max size (square)', () => {
        const sizes: PhotoSize[] = [
            { file_id: 'a', file_unique_id: 'a', width: 100, height: 100 },
            { file_id: 'a', file_unique_id: 'a', width: 800, height: 800 },
            { file_id: 'a', file_unique_id: 'a', width: 400, height: 400 },
        ];
        expect(getMaxPhotoSize(sizes)).toEqual(sizes[1]);
    });

    it('returns PhotoSize the only one size', () => {
        const sizes: PhotoSize[] = [
            { file_id: 'a', file_unique_id: 'a', width: 100, height: 100 },
        ];
        expect(getMaxPhotoSize(sizes)).toEqual(sizes[0]);
    });
})
