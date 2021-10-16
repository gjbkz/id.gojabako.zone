import * as console from 'console';

export const runScript = (asyncFn: () => Promise<void>) => {
    Promise.resolve()
    .then(asyncFn)
    .catch((error: unknown) => {
        console.error(error);
        process.exit(1);
    });
};
