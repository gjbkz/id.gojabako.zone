export const isRecordLike = (input: unknown): input is Record<string, unknown> => {
    switch (typeof input) {
    case 'object':
    case 'function':
        return input !== null;
    default:
        return false;
    }
};
