import {runScript} from '@id.gojabako.zone/util-node/runScript';
import {spawn} from '@id.gojabako.zone/util-node/spawn';
import {listFiles} from '@id.gojabako.zone/util-node/listFiles';
import * as esbuild from 'esbuild';
import * as fs from 'fs';
import {lambdaCodeDirectoryUrl, lambdaLayerDirectoryUrl, lambdaSourceDirectoryUrl} from '../constants';
import packageJson from '../package.json';

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
