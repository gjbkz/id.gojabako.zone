/* eslint-disable @nlib/no-globals */
import {Number, Promise, URL} from '@id.gojabako.zone/util-es/globals';
import * as console from 'console';
import * as fs from 'fs';
import * as http from 'http';
import * as https from 'https';
import next from 'next';
import * as url from 'url';

const getServer = async () => {
    const directoryUrl = new URL('certificates/localhost.gojabako.zone/', import.meta.url);
    let certificates = null;
    try {
        if (!process.argv.includes('--http')) {
            const [key, cert] = await Promise.all([
                fs.promises.readFile(new URL('privkey.pem', directoryUrl)),
                fs.promises.readFile(new URL('fullchain.pem', directoryUrl)),
            ]);
            certificates = {key, cert};
        }
    } catch (error) {
        console.error(error);
    }
    if (certificates) {
        return {
            rootUrl: new URL('https://localhost.gojabako.zone:3000'),
            server: https.createServer(certificates),
        };
    }
    return {
        rootUrl: new URL('https://localhost:3000'),
        server: http.createServer(),
    };
};
const {rootUrl, server} = await getServer();
const app = next({dev: process.env.NODE_ENV !== 'production'});
await app.prepare();
const handleApiRequest = app.getRequestHandler();
server.on('request', (req, res) => {
    if (!req.url.startsWith('/_')) {
        console.info(`${req.method} ${req.url}`);
    }
    const parsedUrl = url.parse(new URL(req.url, rootUrl).href, true);
    if (!parsedUrl.query) {
        parsedUrl.query = {};
    }
    if (req.url.startsWith('/api/')) {
        handleApiRequest(req, res, parsedUrl);
    } else {
        app.render(req, res, parsedUrl.pathname, parsedUrl.query);
    }
});
server.once('error', (error) => {
    console.error(error);
});
server.on('listening', () => {
    console.info(`> Ready on ${rootUrl.href}`);
});
server.listen(Number(rootUrl.port));
