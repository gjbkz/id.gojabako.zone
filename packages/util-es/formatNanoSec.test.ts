import {formatNanoSec} from './formatNanoSec';

describe(formatNanoSec.name, () => {
    it('ns', () => {
        expect(formatNanoSec(1)).toBe('1 ns');
        expect(formatNanoSec(10)).toBe('10 ns');
        expect(formatNanoSec(100)).toBe('100 ns');
    });
    it('μs', () => {
        expect(formatNanoSec(1000)).toBe('1.000 μs');
        expect(formatNanoSec(10000)).toBe('10.000 μs');
        expect(formatNanoSec(100000)).toBe('100.000 μs');
    });
    it('ms', () => {
        expect(formatNanoSec(1000000)).toBe('1.000 ms');
        expect(formatNanoSec(10000000)).toBe('10.000 ms');
        expect(formatNanoSec(100000000)).toBe('100.000 ms');
    });
    it('sec', () => {
        expect(formatNanoSec(1000000000)).toBe('1.000 sec');
        expect(formatNanoSec(59000000000)).toBe('59.000 sec');
    });
    it('min&sec', () => {
        expect(formatNanoSec(60000000000)).toBe('1 min 0.000 sec');
    });
});
