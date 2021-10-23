import * as process from 'process';
import {hostname} from '../../app.config';
import {Set} from '../es/global';
import {kebabCase} from '../es/kebabCase';

export type VercelEnv = 'development' | 'preview' | 'production';
export const vercelEnvs = new Set<VercelEnv>(['development', 'preview', 'production']);
export const vercelEnv = (process.env.VERCEL_ENV || 'development') as VercelEnv;
export const region = process.env.AWS_REGION_MYAPP || 'us-east-1';
export const stackName = kebabCase(`${hostname}-${vercelEnv}`);
