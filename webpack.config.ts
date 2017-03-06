import { join } from 'path'
const { camelCase } = require('lodash')
const { TsConfigPathsPlugin, CheckerPlugin } = require('awesome-typescript-loader')
const TypedocWebpackPlugin = require('typedoc-webpack-plugin')

/**
 * Update this variable if you change your library name
 */
const libraryName = '--libraryname--'

export default {
  entry: join(__dirname, `src/${libraryName}.ts`),
  devtool: 'cheap-source-map',
  output: {
    path: join(__dirname, 'dist'),
    libraryTarget: 'umd',
    library: camelCase(libraryName),
    filename: `${libraryName}.js`
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'awesome-typescript-loader'
          }
        ]
      }
    ]
  },
  plugins: [
    new CheckerPlugin(),
    new TsConfigPathsPlugin(),
    new TypedocWebpackPlugin(
      {
        theme: 'minimal',
        out: 'docs',
        target: 'es6',
        ignoreCompilerErrors: true
      },
      'src'
    )
  ]
}
