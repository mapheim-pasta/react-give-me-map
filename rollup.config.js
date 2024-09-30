import cjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import svgr from '@svgr/rollup';
import babel from 'rollup-plugin-babel';
import globals from 'rollup-plugin-node-globals';
import nodePolyfills from 'rollup-plugin-node-polyfills';
import typescript from 'rollup-plugin-typescript2';

import json from '@rollup/plugin-json';
import packageJson from './package.json';

export default {
    input: './src/index',
    output: [
        {
            file: packageJson.module,
            sourcemap: true,
            exports: 'named',
            format: 'cjs'
        }
    ],
    external: Object.keys(packageJson.peerDependencies),
    plugins: [
        resolve({
            browser: true,
            main: true,
            preferBuiltins: false,
            extensions: ['.ts', '.tsx', '.js', '.jsx', '.json']
        }),
        typescript(),
        babel({
            babelrc: true,
            exclude: 'node_modules/**',
            extensions: ['.ts', '.tsx', '.js', '.jsx'],
            presets: ['@babel/preset-env', '@babel/preset-react'],
            runtimeHelpers: true
        }),
        cjs({
            include: 'node_modules/**'
        }),
        nodePolyfills(),
        globals(),
        json(),
        svgr({
            svgoConfig: {
                plugins: [
                    {
                        name: 'removeViewBox',
                        active: false
                    }
                ]
            }
        })
    ]
};
