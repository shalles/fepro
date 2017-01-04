let path = require('path')
let config = require('../config')
let utils = require('./utils')
let projectRoot = path.resolve(__dirname, '../')

let env = process.env.NODE_ENV
// check env & config/index.js to decide whether to enable CSS source maps for the
// letious preprocessor loaders added to vue-loader at the end of this file
let cssSourceMapDev = (env === 'development' && config.dev.cssSourceMap)
let cssSourceMapProd = (env === 'production' && config.build.productionSourceMap)
let useCssSourceMap = cssSourceMapDev || cssSourceMapProd

module.exports = {
  entry: {
    app: './src/main.js' // 入口文件， 可以有多个入口
  },
  output: {
    path: config.build.assetsRoot,
    publicPath: process.env.NODE_ENV === 'production' ? config.build.assetsPublicPath : config.dev.assetsPublicPath,
    filename: '[name].js'
  },
  resolve: {
    extensions: ['', '.js', '.vue', '.json'],
    fallback: [path.join(__dirname, '../node_modules')],
    alias: {
      'src': path.resolve(__dirname, '../src'),
      'utils': path.resolve(__dirname, '../src/utils'),
      'styles': path.resolve(__dirname, '../src/utils/styles'),
      'scripts': path.resolve(__dirname, '../src/utils/scripts'),
      'assets': path.resolve(__dirname, '../src/assets'),
      'components': path.resolve(__dirname, '../src/components')
    }
  },
  resolveLoader: {
    fallback: [path.join(__dirname, '../node_modules')]
  },
  module: {
    preLoaders: [
      {
        test: /\.js$/,
        loader: 'eslint',
        include: [
          path.join(projectRoot, 'src')
        ],
        exclude: /node_modules/
      }
    ],
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        include: [
          path.join(projectRoot, 'src')
        ],
        exclude: /node_modules/
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url',
        query: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url',
        query: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  scssLoaderConfig: {
    outputStyle: 'expanded',
    importer: require('node-sass-import-once'),
    importerOnce: {
      css: true
    }
  },
  postcssLoaderConfig: function () {
    return [
      require('autoprefixer')({
        browsers: ['last 2 versions']
      })
    ]
  },
  eslint: {
    formatter: require('eslint-friendly-formatter')
  }
}
