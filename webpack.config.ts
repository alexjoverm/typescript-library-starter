import { join, resolve } from 'path'
const { camelCase } = require('lodash')
const webpack = require("webpack")
const { TsConfigPathsPlugin, CheckerPlugin } = require('awesome-typescript-loader')
const TypedocWebpackPlugin = require('typedoc-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const env = process && process.env && process.env.NODE_ENV
const serverPort = process.env.npm_package_config_devPort || 8081
const dev = !(env && env === 'production')

/**
 * Update this variable if you change your library name
 */
const libraryName = '--libraryname--'
const plugins = [
  new CheckerPlugin(),
  new TsConfigPathsPlugin(),
  new HtmlWebpackPlugin({
    inject: true,
    title: libraryName,
    filename: 'index.html',
    template: join(__dirname, 'template/index.html'),
    hash: true,
    chunks: ['common', 'index']
  })
]

let entry: string | string[] = [
  // 'react-hot-loader/patch',
  `webpack-dev-server/client?http://localhost:${serverPort}`,
  // bundle the client for webpack-dev-servers and connect to the provided endpoint
  'webpack/hot/only-dev-server',
  // bundle the client for hot reloading
  `./src/${libraryName}.ts`
]

if (dev === false) {
  plugins.push(new TypedocWebpackPlugin(
    {
      theme: 'minimal',
      out: 'docs',
      target: 'es6',
      ignoreCompilerErrors: true
    },
    'src'
  ))
  entry = join(__dirname, `src/${libraryName}.ts`)
} else {
  plugins.push(new webpack.HotModuleReplacementPlugin())
}

export default {
  entry: {
    index: entry
  },
  // Currently cheap-module-source-map is broken https://github.com/webpack/webpack/issues/4176
  devtool: 'source-map',
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
  plugins: plugins,
  devServer: {
    hot: true,
    contentBase: resolve(__dirname, 'dist'),
    port: serverPort,
    publicPath: '/'
  }
}
