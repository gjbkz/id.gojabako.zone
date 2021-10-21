import {GetCallerIdentityCommand, STSClient} from '@aws-sdk/client-sts';
import {region} from '../../aws/constants';
import {enableCache} from '../es/enableCache';
import {Error, JSON} from '../es/global';

const stsClient = new STSClient({region});

export const getAccountId = enableCache(async () => {
    const command = new GetCallerIdentityCommand({});
    const result = await stsClient.send(command);
    const {Account} = result;
    if (!Account) {
        throw new Error(`NoAccount: ${JSON.stringify(result, null, 2)}`);
    }
    return Account;
});
