import * as iam from '@aws-cdk/aws-iam';
import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import * as events from '@aws-cdk/aws-events';
import * as eventsTargets from '@aws-cdk/aws-events-targets';
import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import {getRelativePath, lambdaCodeDirectoryUrl, lambdaLayerDirectoryUrl, region, getStackName, vercelEnv} from './constants';
import {output} from './output';

const app = new cdk.App();
const stackName = getStackName(vercelEnv);
const stack = new cdk.Stack(app, stackName, {env: {region}});
const dashboard = new cloudwatch.Dashboard(stack, 'Dashboard', {
    /**
     * aws-cdkはdashboardNameの先頭にスタック名をつけないため、手動でつけます。
     * Prefix stackName manually because aws-cdk doesn't do it to LayerVersion.
     */
    dashboardName: stackName,
});
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
output(stack, 'TableName', table.tableName);
const queryPrivateKeyPolicy = new iam.ManagedPolicy(stack, 'QueryPrivateKeyPolicy');
queryPrivateKeyPolicy.addStatements(new iam.PolicyStatement({
    actions: ['dynamodb:Query'],
    resources: [table.tableArn],
    conditions: {
        'ForAllValues:StringEquals': {
            'dynamodb:LeadingKeys': ['PrivateKey'],
        },
    },
}));

const lambdaLayer = new lambda.LayerVersion(stack, 'LambdaLayer', {
    /**
     * aws-cdkはlayerVersionNameの先頭にスタック名をつけないため、手動でつけます。
     * Prefix stackName manually because aws-cdk doesn't do it to LayerVersion.
     */
    layerVersionName: `${stackName}-node14`,
    compatibleRuntimes: [lambda.Runtime.NODEJS_14_X],
    code: new lambda.AssetCode(getRelativePath(lambdaLayerDirectoryUrl)),
});

const roleRotateKey = new iam.Role(stack, 'RotateKeyRole', {
    assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    managedPolicies: [queryPrivateKeyPolicy],
});
const lambdaFnRotateKey: lambda.IFunction = new lambda.Function(stack, 'RotateKey', {
    role: roleRotateKey,
    layers: [lambdaLayer],
    code: new lambda.AssetCode(getRelativePath(new URL('RotateKey', lambdaCodeDirectoryUrl))),
    runtime: lambda.Runtime.NODEJS_14_X,
    handler: 'index.handler',
    environment: {
        TableName: table.tableName,
        TableRegion: table.stack.region,
    },
});

const eventRule = new events.Rule(stack, 'RotationRule', {
    schedule: events.Schedule.rate(cdk.Duration.minutes(1)),
});
eventRule.addTarget(new eventsTargets.LambdaFunction(lambdaFnRotateKey));

for (const lambdaFn of [lambdaFnRotateKey]) {
    const GraphWidth = 18;
    const TextWidth = cloudwatch.GRID_WIDTH - GraphWidth;
    const height = 6;
    dashboard.addWidgets(
        new cloudwatch.TextWidget({
            markdown: [
                `### ${lambdaFn.node.id}`,
                `- [Function](https://console.aws.amazon.com/lambda/home?region=${lambdaFn.stack.region}#/functions/${lambdaFn.functionName}?tab=configure)`,
                `- [CloudWatch Logs](https://console.aws.amazon.com/cloudwatch/home?region=${lambdaFn.stack.region}#logsV2:log-groups/log-group/$252Faws$252Flambda$252F${lambdaFn.functionName})`,
            ].join('\n'),
            width: TextWidth,
            height,
        }),
        new cloudwatch.GraphWidget({
            left: [lambdaFn.metricInvocations(), lambdaFn.metricErrors()],
            right: [lambdaFn.metricDuration()],
            width: GraphWidth,
            height,
        }),
    );
}
