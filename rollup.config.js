
import babel from 'rollup-plugin-babel';
import external from 'rollup-plugin-peer-deps-external';
import { terser } from 'rollup-plugin-terser';
import postcss from 'rollup-plugin-postcss';
import resolve from '@rollup/plugin-node-resolve';
import nodePolyfills from 'rollup-plugin-node-polyfills';
import commonjs from 'rollup-plugin-commonjs';
import replace from '@rollup/plugin-replace';

import React from 'react';
import ReactDOM from 'react-dom';

export default [
  {
    input: './src/index.js',
    output: [
      {
        file: 'dist/index.js',
        format: 'cjs',
      },
      {
        file: 'dist/index.es.js',
        format: 'es',
        exports: 'named',
      }
    ],
    plugins: [
      replace({
          "process.env.NODE_ENV": JSON.stringify("development")
      }),
      nodePolyfills(),
      resolve({
          browser: true
      }),
      commonjs({
          include: /node_modules/,
          namedExports: {
              'react': Object.keys(React),
              'react-dom': Object.keys(ReactDOM),
          }
      }),
      postcss({
        plugins: [],
        minimize: true,
      }),
      babel({
        babelrc: true,
        exclude: 'node_modules/**',
        presets: ['@babel/preset-react']
      }),
      terser()
    ]
  }
];