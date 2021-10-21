import {Buffer} from 'buffer';
import * as childProcess from 'child_process';
import * as process from 'process';
import {Promise} from '../es/global';

export interface SpawnResult {
    stdout: string,
    stderr: string,
}

export const spawn = async (
    command: string,
    {quiet, ...options}: childProcess.ExecOptions & {quiet?: boolean} = {},
): Promise<SpawnResult> => await new Promise<SpawnResult>((resolve, reject) => {
    if (!quiet) {
        process.stdout.write(`> ${command}\n`);
    }
    const subprocess = childProcess.spawn(command, [], {
        shell: true,
        stdio: 'inherit',
        ...options,
    });
    const stdoutChunks: Array<Buffer> = [];
    const stderrChunks: Array<Buffer> = [];
    subprocess.once('error', reject);
    subprocess.once('close', (code) => {
        const stderr = `${Buffer.concat(stderrChunks)}`.trim();
        if (code) {
            reject(stderr);
        } else {
            const stdout = `${Buffer.concat(stdoutChunks)}`.trim();
            resolve({stdout, stderr});
        }
    });
});
