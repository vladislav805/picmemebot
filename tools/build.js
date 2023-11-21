const esbuild = require('esbuild');
const config = require('../esbuild.config');

async function main() {
    const start = Date.now();

    await esbuild.build(config);

    const end = Date.now();

    console.log('Built in %dms', end - start);
}

main();
