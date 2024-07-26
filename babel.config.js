module.exports = function (babelApi) {
    babelApi.cache(false);

    return {
        presets: [
            [
                '@babel/preset-env',
                {
                    modules: false
                }
            ],
            '@babel/preset-react',
            '@babel/preset-typescript'
        ],
        env: {
            test: {
                plugins: [
                    '@babel/plugin-transform-modules-commonjs',
                    'babel-plugin-dynamic-import-node-babel-7',
                    'require-context-hook',
                    [
                        '@babel/plugin-transform-runtime',
                        {
                            absoluteRuntime: false,
                            corejs: false,
                            helpers: true,
                            regenerator: true,
                            useESModules: false
                        }
                    ]
                ]
            }
        },
        plugins: [
            [
                '@babel/plugin-proposal-decorators',
                {
                    legacy: true
                }
            ],
            [
                '@babel/plugin-transform-spread',
                {
                    loose: true
                }
            ],
            [
                '@babel/plugin-transform-runtime',
                {
                    absoluteRuntime: false,
                    corejs: false,
                    helpers: true,
                    regenerator: false,
                    useESModules: false
                }
            ],
            '@babel/plugin-syntax-dynamic-import',
            '@babel/plugin-transform-class-properties',
            [
                'module-resolver',
                {
                    extensions: ['.js', '.jsx', '.ts', '.tsx'],
                    root: ['./client'],
                    alias: {}
                }
            ],
            ['@babel/plugin-transform-optional-chaining']
        ]
    };
};
