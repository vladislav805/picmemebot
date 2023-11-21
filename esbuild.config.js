const path = require('path');

/** @type {import('esbuild').BuildOptions} */
module.exports = {
    entryPoints: {
        index: path.resolve('src', 'index.ts'),
    },
    outfile: path.resolve('dist', 'index.js'),
    bundle: true,
    target: 'node20',
    platform: 'node',
    logLevel: 'warning',
    keepNames: true,
    external: [
        'fs',
        'path',
    ],
    plugins: [],
};
