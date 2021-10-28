// eslint-disable-next-line @nlib/no-globals, no-undef, @typescript-eslint/no-unnecessary-condition, @typescript-eslint/no-invalid-this
const g = globalThis || global || this;
export const {
    Boolean,
    Date,
    Error,
    JSON,
    Math,
    Number,
    Object,
    Promise,
    URL,
    Set,
    WeakMap,
} = g;
