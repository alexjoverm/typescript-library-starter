import { join } from 'path'
import { optimize } from 'webpack'

const env = process && process.env && process.env.NODE_ENV
const tsConfig = env && env === 'production' ? { configFileName: 'tsconfig.prod.json' } : {}

export default {
  entry: join(__dirname, 'src/index.ts'),
  devtool: 'cheap-source-map',
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
      use: [
        {
          loader: 'babel-loader',
          options: { presets: ['es2015'] }
        },
        {
          loader: 'ts-loader',
          options: tsConfig
        }
      ],
      exclude: [
        join(__dirname, 'node_modules'),
        join(__dirname, 'test')
      ]
    }]
  },
  plugins: [
    new optimize.UglifyJsPlugin({sourceMap: true})
  ]
}
