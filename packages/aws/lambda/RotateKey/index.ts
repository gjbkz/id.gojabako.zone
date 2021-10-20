import * as console from 'console';
import {DynamoDBClient, QueryCommand} from '@aws-sdk/client-dynamodb';
import {convertToAttr} from '@aws-sdk/util-dynamodb';

export const handler = async () => {
    console.info({start});
    await client.send(command);
};

const client = new DynamoDBClient({region: process.env.TableRegion});
const command = new QueryCommand({
    TableName: process.env.TableName,
    KeyConditionExpression: 'pk = :pk',
    ExpressionAttributeValues: {
        ':pk': convertToAttr('PrivateKey'),
    },
});
const start = Date.now();
