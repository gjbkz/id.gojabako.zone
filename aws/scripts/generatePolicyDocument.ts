import {STSClient, GetCallerIdentityCommand} from '@aws-sdk/client-sts';
import {runScript} from '../util/runScript';
import {region, stackName} from '../constants';
import {enableCache} from '../util/enableCache';

const stsClient = new STSClient({region});

runScript(async () => {
    const accountId = await getAccountId();
    const policyDocument = getPolicyDocument(accountId);
    process.stdout.write(JSON.stringify(policyDocument, null, 4));
    process.stdout.write('\n');
});

const getAccountId = enableCache(async () => {
    const command = new GetCallerIdentityCommand({});
    const result = await stsClient.send(command);
    const {Account} = result;
    if (!Account) {
        throw new Error(`NoAccount: ${JSON.stringify(result, null, 2)}`);
    }
    return Account;
});

// eslint-disable-next-line max-lines-per-function
const getPolicyDocument = (accountId: string) => ({
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
});
