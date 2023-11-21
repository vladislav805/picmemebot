const cp = require('child_process');

const chalk = require('chalk');
const esbuild = require('esbuild');

const config = require('../esbuild.config');

config.plugins.push({
    name: 'restart-on-rebuild',

    setup(build) {
        /** @type {cp.ChildProcessWithoutNullStreams | undefined} */
        let server = undefined;

        /** @type {number} */
        let started;

        build.onStart(() => {
            if (server !== undefined) {
                server.kill();
            }

            started = Date.now();

            console.log(chalk.green('Rebuild in progress'));
        });

        build.onEnd(() => {
            const now = Date.now();

            console.log(chalk.bgGreen('Server build in %dms, restarting...'), now - started);

            server = cp.spawn('node', [build.initialOptions.outfile], {
                env: process.env,
            });

            server.stdout.pipe(process.stdout);
            server.stderr.pipe(process.stderr);

            server.on('close', (code) => {
                console.log(chalk.red(`Server process exited with code ${code}`));
            });
        });
    },
});

async function main() {
    const context = await esbuild.context(config)

    context.watch().then(() => {
        console.log('Watcher started');
    });
}

main();
