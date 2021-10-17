import * as console from 'console';

export const runScript = (asyncFn: () => Promise<unknown>) => {
    const startAt = process.hrtime.bigint();
    Promise.resolve()
    .then(asyncFn)
    .then((result) => {
        const endAt = process.hrtime.bigint();
        const elapsed = endAt - startAt;
        console.info(`elapsed: ${elapsed}`);
        if (typeof result !== 'undefined') {
            console.info(result);
        }
    })
    .catch((error: unknown) => {
        console.error(error);
        process.exit(1);
    });
};
