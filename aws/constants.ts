import packageJson from '../package.json';

export const vercelEnv = process.env.VERCEL_ENV || 'develop';
export const region = process.env.AWS_REGION_MYAPP || 'us-east-1';
export const stackName = `${packageJson.name.replace(/[^\w-]+/g, '-')}-${vercelEnv}`;
