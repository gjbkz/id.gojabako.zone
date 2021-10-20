import {getAccountId} from '@id.gojabako.zone/util-aws/getAccountId';
import {runScript} from '@id.gojabako.zone/util-node/runScript';
import * as fs from 'fs';
import {getStackName, region, rootDirectoryUrl} from '../constants';

runScript(async () => {
    const accountId = await getAccountId();
    const destDirectoryUrl = new URL('cdk.out/policy/', rootDirectoryUrl);
    await fs.promises.mkdir(destDirectoryUrl, {recursive: true});
    for (const env of ['develop', 'staging', 'production']) {
        const policyDocument = getPolicyDocument(accountId, env);
        const destUrl = new URL(`${env}.json`, destDirectoryUrl);
        await fs.promises.writeFile(destUrl, JSON.stringify(policyDocument, null, 4));
        const relativePath = destUrl.pathname.slice(rootDirectoryUrl.pathname.length);
        process.stdout.write(`written: ${relativePath}\n`);
    }
});

// eslint-disable-next-line max-lines-per-function
const getPolicyDocument = (accountId: string, env: string) => {
    const stackName = getStackName(env);
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
