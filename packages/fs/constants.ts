import {URL} from '../es/global';

// eslint-disable-next-line @nlib/no-globals
export const rootDirectoryUrl = new URL('../..', `file://${__dirname}/`);
export const lambdaSourceDirectoryUrl = new URL('packages/lambda/', rootDirectoryUrl);
export const lambdaLayerDirectoryUrl = new URL('cdk.out/lambda/layer/', rootDirectoryUrl);
export const lambdaCodeDirectoryUrl = new URL('cdk.out/lambda/code/', rootDirectoryUrl);
