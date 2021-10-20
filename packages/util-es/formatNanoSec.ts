import {Math} from './globals';

const ns1Sec = 1000000000;
const ns1Min = 60000000000;

export const formatNanoSec = (ns: number): string => {
    if (ns < 0) {
        return `- ${formatNanoSec(-ns)}`;
    }
    if (ns1Min <= ns) {
        const min = Math.floor(ns / ns1Min);
        const sec = (ns % ns1Min) / ns1Sec;
        return `${min.toFixed(0)} min ${sec.toFixed(3)} sec`;
    }
    const log10 = Math.log10(ns);
    if (log10 < 3) {
        return `${ns} ns`;
    }
    const unit = Math.floor(log10 / 3) - 1;
    const significand = ns / (10 ** (3 + unit * 3));
    return `${significand.toFixed(3)} ${['μs', 'ms', 'sec'][unit]}`;
};
