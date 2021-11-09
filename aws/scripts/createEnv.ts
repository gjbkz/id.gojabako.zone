import * as fs from 'fs';
import {Error, JSON, URL} from '../../packages/es/global';
import {runScript} from '../../packages/node/runScript';
import {rootDirectoryUrl} from '../../packages/fs/constants';
import {stackName} from '../../packages/aws/constants';

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
