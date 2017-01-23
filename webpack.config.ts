import { join } from 'path'
import { optimize } from 'webpack'

export default {
  entry: join(__dirname, 'src/index.ts'),
  output: {
    path: join(__dirname, 'dist'),
    libraryTarget: 'umd',
    library: 'shortcutJS',
    filename: 'shortcut.js'
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [{
      test: /\.ts$/,
      use: ['babel-loader', 'awesome-typescript-loader'],
      exclude: /node_modules/
    }]
  },
  plugins: [
    new optimize.UglifyJsPlugin ({
      compress: {
        warnings: false
      }
    })
  ]
}
