const path = require('path')
const webpack = require('webpack')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')

module.exports = {
  mode: 'production',
  entry: {
    app: [
      './src/index.tsx'
    ]
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[hash].js'
  },
  module: {
    rules: [
      {
        test: /\.(t|j)sx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader?modules&localIdentName=[name]__[local]___[hash:base64:5]',
          {
            loader: "sass-loader",
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
  stats: {
    modules: true,
    errorDetails: true
  },
  optimization: {
    concatenateModules: true,
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          unused: true,
          evaluate: true,
          warnings: false,
          screw_ie8: true,
          sequences: true,
          dead_code: true,
          if_return: true,
          join_vars: true,
          comparisons: true,
          drop_console: true,
          conditionals: true,
          output: {
            comments: false
          }
        }
      }),
    ],
    splitChunks: {
      name: true,
      cacheGroups: {
        commons: {
          chunks: 'initial',
          minChunks: 2
        },
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          chunks: 'all',
          priority: -10
        }
      }
    },
    runtimeChunk: true
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html',
      inject: 'body',
      minify: {
        collapseWhitespace: true,
        collapseInlineTagWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true
      }
    }),
    new ScriptExtHtmlWebpackPlugin({
      defaultAttribute: 'defer'
    }),
    new CopyWebpackPlugin([{ from: 'public' }]),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ]
}
