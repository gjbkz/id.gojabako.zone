import packageJson from '../package.json';

export const vercelEnv = process.env.VERCEL_ENV || 'develop';
export const region = process.env.AWS_REGION_MYAPP || 'us-east-1';
export const policyName = packageJson.name.replace(/[^\w-]+/g, '-');
export const stackName = `${policyName}-${vercelEnv}`;

export const rootDirectoryUrl = new URL('..', `file://${__dirname}/`);
export const lambdaSourceDirectoryUrl = new URL('aws/lambda/', rootDirectoryUrl);
export const lambdaDirectoryUrl = new URL('cdk.out/lambda/', rootDirectoryUrl);
export const layerDirectoryUrl = new URL('cdk.out/layer/', rootDirectoryUrl);
