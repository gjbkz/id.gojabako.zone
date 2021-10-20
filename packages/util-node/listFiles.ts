import * as fs from 'fs';

export const listFiles = async function* (directoryUrl: URL): AsyncGenerator<URL> {
    for (const name of await fs.promises.readdir(directoryUrl)) {
        const fileUrl = new URL(name, directoryUrl);
        const stats = await fs.promises.stat(fileUrl);
        if (stats.isDirectory()) {
            yield* listFiles(new URL(`${name}/`, directoryUrl));
        } else if (stats.isFile()) {
            yield fileUrl;
        }
    }
};
