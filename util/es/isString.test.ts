import {isString} from './isString';

describe(isString.name, () => {
    it('should return false for function', () => {
        expect(isString(() => null)).toBe(false);
    });
    it('should return false for object', () => {
        expect(isString({})).toBe(false);
        expect(isString([])).toBe(false);
        expect(isString(isString)).toBe(false);
    });
    it('should return false for null', () => {
        expect(isString(null)).toBe(false);
    });
    it('should return false for undefined', () => {
        expect(isString(undefined)).toBe(false);
    });
    it('should return false for boolean', () => {
        expect(isString(true)).toBe(false);
        expect(isString(false)).toBe(false);
    });
    it('should return false for number', () => {
        expect(isString(-Infinity)).toBe(false);
        expect(isString(Infinity)).toBe(false);
        expect(isString(NaN)).toBe(false);
        expect(isString(0)).toBe(false);
    });
    it('should return true for string', () => {
        expect(isString('')).toBe(true);
        expect(isString('a')).toBe(true);
    });
});
