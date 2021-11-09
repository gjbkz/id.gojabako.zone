import * as fs from 'fs';
import * as process from 'process';
import {getAccountId} from '../../packages/aws/getAccountId';
import {JSON, URL} from '../../packages/es/global';
import {runScript} from '../../packages/node/runScript';
import {rootDirectoryUrl} from '../../packages/fs/constants';
import {kebabCase} from '../../packages/es/kebabCase';
import {hostname} from '../../app.config';
import type {VercelEnv} from '../../packages/aws/constants';
import {region, vercelEnvs} from '../../packages/aws/constants';
import {getPathToAsset} from '../../packages/fs/getPathToAsset';

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
