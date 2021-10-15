import * as cdk from '@aws-cdk/core';

export const output = (
    construct: cdk.Construct,
    id: string,
    value: string,
) => new cdk.CfnOutput(construct, id, {value});
