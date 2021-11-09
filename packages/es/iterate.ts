import {Array} from './global';

export const iterate = function* <T>(...args: Array<Array<T> | T>): Generator<T> {
    for (const arg of args) {
        if (Array.isArray(arg)) {
            yield* iterate(...arg);
        } else {
            yield arg;
        }
    }
};
