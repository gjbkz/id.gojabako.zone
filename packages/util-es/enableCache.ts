import {WeakMap} from './globals';

const cache = new WeakMap<() => unknown, {value: unknown}>();
export const enableCache = <T>(cachee: () => T) => () => {
    let cached = cache.get(cachee);
    if (!cached) {
        const value = cachee();
        cached = {value};
    }
    return cached.value as T;
};
