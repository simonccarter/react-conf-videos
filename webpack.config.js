const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const { CheckerPlugin } = require('awesome-typescript-loader')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
  mode: 'development',
  entry: {
    app: [
      'webpack-dev-server/client?http://localhost:8080',
      'webpack/hot/only-dev-server',
      'react-hot-loader/patch',
      './src/index.tsx'
    ]
  },
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[hash].js'
  },
  stats: {
    errorDetails: true
  },
  module: {
    rules: [
      {
        test: /\.(t|j)sx?$/,
        loader: 'awesome-typescript-loader',
        exclude: /node_modules/
      },
      {
        test: /\.js$/,
        enforce: 'pre',
        loader: 'source-map-loader'
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader?modules&localIdentName=[name]__[local]___[hash:base64:5]',
          {
            loader: "sass-loader",
            exclude: /AnimationShell.scss$/,
            options: { 
              data: '@import "_colors";',
              includePaths: [
                path.resolve(__dirname, "./src/styles/")
              ]
            }
          }
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader'
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.json', '.ts', '.tsx', '.scss'],
    modules: [
      path.resolve(__dirname, 'src'),
      path.resolve(__dirname, 'public'),
      'node_modules'
    ]
  },
  plugins: [
    new CheckerPlugin(),
    new ProgressBarPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html',
      inject: 'body'
    }),
    new BundleAnalyzerPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    })
  ],
  devServer: {
    hot: true,
    historyApiFallback: true
  }
}
