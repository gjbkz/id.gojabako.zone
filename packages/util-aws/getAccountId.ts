import {enableCache} from '@id.gojabako.zone/util-es/enableCache';
import {GetCallerIdentityCommand, STSClient} from '@aws-sdk/client-sts';

const stsClient = new STSClient({region: process.env.AWS_REGION || 'us-east-1'});

export const getAccountId = enableCache(async () => {
    const command = new GetCallerIdentityCommand({});
    const result = await stsClient.send(command);
    const {Account} = result;
    if (!Account) {
        throw new Error(`NoAccount: ${JSON.stringify(result, null, 2)}`);
    }
    return Account;
});
