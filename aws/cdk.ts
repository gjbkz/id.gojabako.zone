import * as cdk from '@aws-cdk/core';
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import {stackName, region, vercelEnv} from './constants';
import {output} from './output';

const app = new cdk.App();
const stack = new cdk.Stack(app, stackName, {env: {region}});
/**
 * DO NOT CHANGE, or existing data will be lost due to table replacement.
 * デプロイ後にここを変更するとテーブルが置換されるので既存のデータがなくなります。
 */
const table = new dynamodb.Table(stack, 'Table', {
    partitionKey: {name: 'pk', type: dynamodb.AttributeType.STRING},
    sortKey: {name: 'sk', type: dynamodb.AttributeType.STRING},
    timeToLiveAttribute: 'ttl',
    /**
     * DynamoDB doesn't support RemovalPolicy.SNAPSHOT as of 2021.
     * RemovalPolicy.SNAPSHOTがあればデータ消失リスクが解消されますが、2021年時点でまだありません。
     * https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-attribute-updatereplacepolicy.html
     * https://github.com/aws-cloudformation/cloudformation-coverage-roadmap/issues/224
     */
    removalPolicy: vercelEnv === 'develop' ? cdk.RemovalPolicy.DESTROY : cdk.RemovalPolicy.RETAIN,
});
output(stack, 'TableArn', table.tableArn);
