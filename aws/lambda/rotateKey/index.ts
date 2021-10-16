import * as console from 'console';
import {DynamoDBClient, QueryCommand} from '@aws-sdk/client-dynamodb';
import {convertToAttr} from '@aws-sdk/util-dynamodb';

const client = new DynamoDBClient({});
const command = new QueryCommand({
    TableName: process.env.TableName,
    KeyConditionExpression: 'pk = :pk',
    ExpressionAttributeValues: {
        pk: convertToAttr('PrivateKey'),
    },
});

export const handler = async () => {
    const result = await client.send(command);
    console.info(result);
};
