import * as fs from 'fs';
import * as process from 'process';
import {hostname} from '../../app.config';
import type {VercelEnv} from '../aws/constants';
import {region, vercelEnvs} from '../aws/constants';
import {getAccountId} from '../aws/getAccountId';
import {JSON, URL} from '../es/global';
import {kebabCase} from '../es/kebabCase';
import {rootDirectoryUrl} from '../fs/constants';
import {getPathToAsset} from '../fs/getPathToAsset';
import {runScript} from '../node/runScript';

runScript(async () => {
    const accountId = await getAccountId();
    const destDirectoryUrl = new URL('cdk.out/policy/', rootDirectoryUrl);
    await fs.promises.mkdir(destDirectoryUrl, {recursive: true});
    for (const vercelEnv of vercelEnvs) {
        const policyDocument = getPolicyDocument(accountId, vercelEnv);
        const destUrl = new URL(`${vercelEnv}.json`, destDirectoryUrl);
        await fs.promises.writeFile(destUrl, JSON.stringify(policyDocument, null, 4));
        process.stdout.write(`written: ${getPathToAsset(destUrl)}\n`);
    }
});

// eslint-disable-next-line max-lines-per-function
const getPolicyDocument = (accountId: string, vercelEnv: VercelEnv) => {
    const stackName = kebabCase(`${hostname}-${vercelEnv}`);
    return {
        Version: '2012-10-17',
        Statement: [
            {
                Effect: 'Allow',
                Action: ['iam:*Policy', 'iam:*PolicyVersion', 'iam:*PolicyVersions'],
                Resource: [`arn:aws:iam::${accountId}:policy/${stackName}*`],
            },
            {
                Effect: 'Allow',
                Action: ['iam:*Role'],
                Resource: [`arn:aws:iam::${accountId}:role/${stackName}*`],
            },
            {
                Effect: 'Allow',
                Action: ['s3:*Object'],
                Resource: ['arn:aws:s3:::cdktoolkit-stagingbucket*/*'],
            },
            {
                Effect: 'Allow',
                Action: ['dynamodb:*Table', 'dynamodb:*TimeToLive'],
                Resource: [`arn:aws:dynamodb:${region}:${accountId}:table/${stackName}*`],
            },
            {
                Effect: 'Allow',
                Action: ['cloudformation:*Stack', 'cloudformation:*ChangeSet'],
                Resource: [`arn:aws:cloudformation:${region}:${accountId}:stack/${stackName}*/*`],
            },
            {
                Effect: 'Allow',
                Action: ['iam:*Role', 'iam:*RolePolicy'],
                Resource: [`arn:aws:iam::${accountId}:role/${stackName}*`],
            },
            {
                Effect: 'Allow',
                Action: [
                    'lambda:*Function',
                    'lambda:*FunctionConfiguration',
                    'lambda:*FunctionCode',
                    'lambda:*Permission',
                ],
                Resource: [`arn:aws:lambda:${region}:${accountId}:function:${stackName}*`],
            },
            {
                Effect: 'Allow',
                Action: ['lambda:*LayerVersion'],
                Resource: [`arn:aws:lambda:${region}:${accountId}:layer:${stackName}*`],
            },
            {
                Effect: 'Allow',
                Action: ['events:*Rule', 'events:*Targets'],
                Resource: [`arn:aws:events:${region}:${accountId}:rule/${stackName}*`],
            },
            {
                Effect: 'Allow',
                Action: ['cloudwatch:*Dashboard', 'cloudwatch:*Dashboards'],
                Resource: [`arn:aws:cloudwatch::${accountId}:dashboard/${stackName}*`],
            },
        ],
    };
};
