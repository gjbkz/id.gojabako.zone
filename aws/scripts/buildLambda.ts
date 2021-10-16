import * as fs from 'fs';
import * as esbuild from 'esbuild';
import packageJson from '../../package.json';

import {rootDirectoryUrl} from '../constants';
import {runScript} from '../util/runScript';

const lambdaDirectoryUrl = new URL('aws/lambda/', rootDirectoryUrl);
const outputDirectoryUrl = new URL('cdk.out/lambda/', rootDirectoryUrl);

runScript(async () => {
    await Promise.all([
        bundleCode(),
    ]);
});

const bundleCode = async () => {
    for await (const fileUrl of listLambdaHandlers()) {
        const destUrl = new URL(
            fileUrl.pathname.slice(lambdaDirectoryUrl.pathname.length),
            outputDirectoryUrl,
        );
        await esbuild.build({
            entryPoints: [fileUrl.pathname],
            outfile: destUrl.pathname,
            bundle: true,
            platform: 'node',
            external: Object.keys(packageJson.dependencies as Record<string, unknown>),
            format: 'cjs',
        });
    }
};

const listLambdaHandlers = async function* (): AsyncGenerator<URL> {
    for await (const fileUrl of listFiles(lambdaDirectoryUrl)) {
        if (fileUrl.pathname.endsWith('/index.ts')) {
            yield fileUrl;
        }
    }
};

const listFiles = async function* (directoryUrl: URL): AsyncGenerator<URL> {
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

