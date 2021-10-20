/* eslint-disable @nlib/no-globals */
const EsifyCSSWebpackPlugin = require('esifycss-webpack-plugin');

module.exports = {
    reactStrictMode: true,
    pageExtensions: ['tsx', 'ts'],
    webpack: (config) => {
        config.resolve.plugins.push(new EsifyCSSWebpackPlugin());
        return config;
    },
    rewrites: async () => {
        await Promise.resolve();
        return [
            {source: '/.well-known/:path*', destination: '/api/:path*'},
        ];
    },
};
