import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
const pkg = require('./package.json')
const { camelCase } = require('lodash')

const libraryName = '--libraryname--'

export default {
  entry: `compiled/${libraryName}.js`,
  targets: [
		{ dest: pkg.main, moduleName: camelCase(libraryName), format: 'umd' },
		{ dest: pkg.module, format: 'es' }
  ],
  sourceMap: true,
  // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
  external: [],
  plugins: [
    // Allow bundling cjs modules (unlike webpack, rollup doesn't undestand cjs)
    commonjs(),
     // Allow node_modules resolution, so you can use 'external' to control
     // which external modules to include in the bundle
    resolve(),
    // Don't transpile node_modules. You may change this if you wanna transpile something in there
    babel({ exclude: 'node_modules/**' })
  ]
}
