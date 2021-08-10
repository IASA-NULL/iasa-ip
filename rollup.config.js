import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import sveltePreprocess from 'svelte-preprocess';
import typescript from '@rollup/plugin-typescript';
import css from 'rollup-plugin-css-only';
import json from "@rollup/plugin-json";
import {nodeResolve} from '@rollup/plugin-node-resolve';
import externals from 'rollup-plugin-node-externals'
import copy from 'rollup-plugin-copy'

const production = !process.env.ROLLUP_WATCH;

function nodeConfig(entryName) {
    return {
        input: `src/${entryName}.ts`,
        output: {
            sourcemap: !production,
            format: 'cjs',
            file: `build/${entryName}.js`
        },
        plugins: [
            externals({deps: true}),
            nodeResolve(),
            json(),
            commonjs({
                include: './node_modules/**',
            }),
            typescript({
                sourceMap: !production,
                inlineSources: !production
            })
        ],
        watch: {
            clearScreen: false
        }
    }
}

function svelteConfig(entryName) {
    return {
        input: `src/ui/${entryName}/main.ts`,
        output: {
            sourcemap: !production,
            format: 'iife',
            name: entryName,
            file: `build/ui/${entryName}/main.js`
        },
        plugins: [
            copy({
                targets: [{
                    src: 'src/static/style/**/*',
                    dest: `build/ui/${entryName}/style`,
                    flatten: false
                }, {
                    src: 'src/static/index.html',
                    dest: `build/ui/${entryName}`,
                    transform: (contents, filename) => contents.toString().replace('__ENTRY__', entryName)
                }]
            }),
            json(),
            svelte({
                preprocess: sveltePreprocess({sourceMap: !production}),
                compilerOptions: {
                    dev: !production
                }
            }),
            css({output: 'main.css'}),
            nodeResolve(),
            resolve({
                browser: true,
                dedupe: ['svelte']
            }),
            commonjs(),
            typescript({
                sourceMap: !production,
                inlineSources: !production
            })
        ],
        watch: {
            clearScreen: false
        }
    }
}

export default [
    nodeConfig('electron/main'),
    nodeConfig('electron/preload'),
    nodeConfig('backend/main'),
    nodeConfig('backend/build'),

    svelteConfig('main'),
    svelteConfig('welcome'),
    svelteConfig('renew')
];
