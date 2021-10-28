/* eslint-disable @nlib/no-globals */
import EsifyCSSWebpackPlugin from 'esifycss-webpack-plugin';

const nextConfig = {
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

export default nextConfig;
