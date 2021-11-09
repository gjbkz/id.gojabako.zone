import * as fs from 'fs';
import {stackName} from '../aws/constants';
import {Error, JSON, URL} from '../es/global';
import {rootDirectoryUrl} from '../fs/constants';
import {runScript} from '../node/runScript';

type CDKOutput = Record<string, Record<string, string | undefined>>;

runScript(async () => {
    const jsonFileUrl = new URL('cdk.out/output.json', rootDirectoryUrl);
    const json = await fs.promises.readFile(jsonFileUrl, 'utf8');
    const {[stackName]: {TableName}} = JSON.parse(json) as CDKOutput;
    if (!TableName) {
        throw new Error('NoTableName');
    }
    const envFileUrl = new URL('.env.local', rootDirectoryUrl);
    await fs.promises.writeFile(envFileUrl, [
        `TableName=${TableName}`,
        '',
    ].join('\n'));
});
