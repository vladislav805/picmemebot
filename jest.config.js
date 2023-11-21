const tsconfig = require('./tsconfig.json');

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    testMatch: [
        '**/*.test.ts',
    ],
    transform: {
        '^.+\\.[tj]sx?$': [
            'ts-jest',
            {
                tsconfig: {
                    ...tsconfig.compilerOptions,
                    verbatimModuleSyntax: false,
                    module: 'commonjs',
                },
            },
        ],
    },
};
