import { join } from 'path'

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
      use: ['babel-loader', 'ts-loader'],
      exclude: /node_modules/
    }]
  }
}
