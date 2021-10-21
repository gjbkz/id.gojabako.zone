import * as esbuild from 'esbuild';
import * as fs from 'fs';
import packageJson from '../../package.json';
import {runScript} from '../../util/node/runScript';
import {spawn} from '../../util/node/spawn';
import {lambdaCodeDirectoryUrl, lambdaLayerDirectoryUrl, lambdaSourceDirectoryUrl} from '../constants';

runScript(async () => {
    const [handlers, dependencies] = await Promise.all([bundleCode(), bundleLayer()]);
    return {handlers, dependencies};
});

const bundleCode = async () => {
    const handlerFileNames: Array<string> = [];
    const external = Object.keys(packageJson.dependencies);
    for await (const fileUrl of listLambdaHandlerFileUrls()) {
        const relativePath = fileUrl.pathname.slice(lambdaSourceDirectoryUrl.pathname.length);
        const destUrl = new URL(relativePath.replace(/\.ts$/, '.js'), lambdaCodeDirectoryUrl);
        esbuild.buildSync({
            entryPoints: [fileUrl.pathname],
            outfile: destUrl.pathname,
            bundle: true,
            platform: 'node',
            external,
            format: 'cjs',
        });
        handlerFileNames.push(relativePath);
    }
    return handlerFileNames;
};

const bundleLayer = async () => {
    const nodeLayerDirectoryUrl = new URL('nodejs/', lambdaLayerDirectoryUrl);
    await fs.promises.mkdir(nodeLayerDirectoryUrl, {recursive: true});
    const packageJsonUrl = new URL('package.json', nodeLayerDirectoryUrl);
    await fs.promises.writeFile(packageJsonUrl, JSON.stringify({
        private: true,
        dependencies: packageJson.dependencies,
    }, null, 4));
    await spawn('npm install --production', {cwd: nodeLayerDirectoryUrl});
    return packageJson.dependencies;
};

const listLambdaHandlerFileUrls = async function* (): AsyncGenerator<URL> {
    for await (const fileUrl of listFiles(lambdaSourceDirectoryUrl)) {
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

