import {STSClient, GetCallerIdentityCommand} from '@aws-sdk/client-sts';
import {runScript} from '../util/runScript';
import {region} from '../constants';
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
            Action: [
                's3:GetObject',
            ],
            Resource: [
                'arn:aws:s3:::cdktoolkit-stagingbucket-*/*',
            ],
        },
        {
            Effect: 'Allow',
            Action: [
                'dynamodb:DescribeTable',
                'dynamodb:CreateTable',
                'dynamodb:DeleteTable',
                'dynamodb:UpdateTable',
                'dynamodb:DescribeTimeToLive',
                'dynamodb:UpdateTimeToLive',
            ],
            Resource: [
                `arn:aws:dynamodb:${region}:${accountId}:table/id-gojabako-zone-*`,
            ],
        },
        {
            Effect: 'Allow',
            Action: [
                'cloudformation:DeleteStack',
                'cloudformation:CreateChangeSet',
                'cloudformation:DescribeChangeSet',
                'cloudformation:ExecuteChangeSet',
                'cloudformation:DeleteChangeSet',
            ],
            Resource: [
                `arn:aws:cloudformation:${region}:${accountId}:stack/id-gojabako-zone-*/*`,
            ],
        },
        {
            Effect: 'Allow',
            Action: [
                'iam:CreateRole',
                'iam:GetRole',
                'iam:PassRole',
                'iam:DeleteRole',
                'iam:AttachRolePolicy',
                'iam:DetachRolePolicy',
            ],
            Resource: [
                `arn:aws:iam::${accountId}:role/id-gojabako-zone-*`,
            ],
        },
        {
            Effect: 'Allow',
            Action: [
                'lambda:CreateFunction',
                'lambda:UpdateFunctionConfiguration',
                'lambda:DeleteFunction',
            ],
            Resource: [
                `arn:aws:lambda:${region}:${accountId}:function:id-gojabako-zone-*`,
            ],
        },
        {
            Effect: 'Allow',
            Action: [
                'lambda:PublishLayerVersion',
                'lambda:DeleteLayerVersion',
            ],
            Resource: [
                `arn:aws:lambda:${region}:${accountId}:layer:id-gojabako-zone-*`,
            ],
        },
    ],
});
