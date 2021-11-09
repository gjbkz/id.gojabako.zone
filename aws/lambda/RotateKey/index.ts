import * as console from 'console';
import * as process from 'process';
import {DynamoDBClient, QueryCommand} from '@aws-sdk/client-dynamodb';
import {convertToAttr} from '@aws-sdk/util-dynamodb';
import {Date} from '../../../packages/es/global';

const client = new DynamoDBClient({region: process.env.TableRegion});
const command = new QueryCommand({
    TableName: process.env.TableName,
    KeyConditionExpression: 'pk = :pk',
    ExpressionAttributeValues: {
        ':pk': convertToAttr('PrivateKey'),
    },
});
const start = Date.now();

export const handler = async () => {
    console.info({start});
    await client.send(command);
};
