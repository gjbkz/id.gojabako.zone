import {isRecordLike} from './isRecordLike';

describe(isRecordLike.name, () => {
    it('should return true for function', () => {
        expect(isRecordLike(() => null)).toBe(true);
    });
    it('should return true for object', () => {
        expect(isRecordLike({})).toBe(true);
        expect(isRecordLike([])).toBe(true);
        expect(isRecordLike(isRecordLike)).toBe(true);
    });
    it('should return false for null', () => {
        expect(isRecordLike(null)).toBe(false);
    });
    it('should return false for undefined', () => {
        expect(isRecordLike(undefined)).toBe(false);
    });
    it('should return false for boolean', () => {
        expect(isRecordLike(true)).toBe(false);
        expect(isRecordLike(false)).toBe(false);
    });
    it('should return false for number', () => {
        expect(isRecordLike(-Infinity)).toBe(false);
        expect(isRecordLike(Infinity)).toBe(false);
        expect(isRecordLike(NaN)).toBe(false);
        expect(isRecordLike(0)).toBe(false);
    });
    it('should return false for string', () => {
        expect(isRecordLike('')).toBe(false);
        expect(isRecordLike('a')).toBe(false);
    });
});
