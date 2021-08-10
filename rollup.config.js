import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import sveltePreprocess from 'svelte-preprocess';
import typescript from '@rollup/plugin-typescript';
import css from 'rollup-plugin-css-only';
import json from "@rollup/plugin-json";
import {nodeResolve} from '@rollup/plugin-node-resolve';
import externals from 'rollup-plugin-node-externals'

const production = !process.env.ROLLUP_WATCH;

export default [{
    input: 'src/electron/main.ts',
    output: {
        sourcemap: true,
        format: 'cjs',
        file: 'build/main.js'
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
}, {
    input: 'src/electron/preload.ts',
    output: {
        sourcemap: true,
        format: 'cjs',
        name: 'electron',
        file: 'build/preload.js'
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
}, {
    input: 'src/backend/main.ts',
    output: {
        sourcemap: true,
        format: 'cjs',
        name: 'backend',
        file: 'build/backend.js'
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
}, {
    input: 'src/backend/build.ts',
    output: {
        sourcemap: true,
        format: 'cjs',
        name: 'backend_build',
        file: 'build/backend_build.js'
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
}, {
    input: 'src/ui/main.ts',
    output: {
        sourcemap: true,
        format: 'iife',
        name: 'ui',
        file: 'build/bundle.js'
    },
    plugins: [
        json(),
        svelte({
            preprocess: sveltePreprocess({sourceMap: !production}),
            compilerOptions: {
                dev: !production
            }
        }),
        css({output: 'bundle.css'}),
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
}];