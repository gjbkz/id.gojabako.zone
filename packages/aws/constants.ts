import {siteName} from '@id.gojabako.zone/util-es/constants';

export const vercelEnv = process.env.VERCEL_ENV || 'develop';
export const region = process.env.AWS_REGION_MYAPP || 'us-east-1';
export const policyName = siteName.replace(/[^\w-]+/g, '-');
export const getStackName = (env: string) => `${policyName}-${env}`;

export const rootDirectoryUrl = new URL('..', `file://${__dirname}/`);
export const lambdaSourceDirectoryUrl = new URL('aws/lambda/', rootDirectoryUrl);
export const lambdaLayerDirectoryUrl = new URL('cdk.out/lambda/layer/', rootDirectoryUrl);
export const lambdaCodeDirectoryUrl = new URL('cdk.out/lambda/code/', rootDirectoryUrl);
export const getRelativePath = ({pathname}: URL): string => {
    const {pathname: rootDirectoryPathname} = rootDirectoryUrl;
    if (pathname.startsWith(rootDirectoryPathname)) {
        return pathname.slice(rootDirectoryPathname.length);
    }
    throw new Error(`UnexpectedExternalPathname:${pathname}`);
};
