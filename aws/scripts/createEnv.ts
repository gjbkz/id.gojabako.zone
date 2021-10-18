import * as fs from 'fs';
import {getStackName, rootDirectoryUrl, vercelEnv} from '../constants';
import {runScript} from '../util/runScript';

type CDKOutput = Record<string, Record<string, string | undefined>>;

runScript(async () => {
    const jsonFileUrl = new URL('cdk.out/output.json', rootDirectoryUrl);
    const json = await fs.promises.readFile(jsonFileUrl, 'utf8');
    const {
        [getStackName(vercelEnv)]: {TableName},
    } = JSON.parse(json) as CDKOutput;
    if (!TableName) {
        throw new Error('NoTableName');
    }
    const envFileUrl = new URL('.env.local', rootDirectoryUrl);
    await fs.promises.writeFile(envFileUrl, [
        `TableName=${TableName}`,
        '',
    ].join('\n'));
});
