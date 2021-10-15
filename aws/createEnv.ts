import * as fs from 'fs';
import * as console from 'console';
import {stackName} from './constants';

type CDKOutput = Record<string, Record<string, string | undefined>>;

const createEnv = async () => {
    const rootDirectoryUrl = new URL('..', `file://${__dirname}/`);
    const jsonFileUrl = new URL('cdk.out/output.json', rootDirectoryUrl);
    const json = await fs.promises.readFile(jsonFileUrl, 'utf8');
    const {
        [stackName]: {TableArn},
    } = JSON.parse(json) as CDKOutput;
    if (!TableArn) {
        throw new Error('NoTableArn');
    }
    const envFileUrl = new URL('.env.local', rootDirectoryUrl);
    console.info(envFileUrl.pathname);
    await fs.promises.writeFile(envFileUrl, [
        `TableArn=${TableArn}`,
    ].join('\n'));
};

createEnv().catch((error: unknown) => {
    console.error(error);
    process.exit(1);
});
