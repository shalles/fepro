var path = require('path')
var config = require('../config')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

exports.assetsPath = function (_path) {
  var assetsSubDirectory = process.env.NODE_ENV === 'production'
    ? config.build.assetsSubDirectory
    : config.dev.assetsSubDirectory
  return path.posix.join(assetsSubDirectory, _path)
}

exports.cssLoaders = function (options) {
  options = options || {}
  // generate loader string to be used with extract text plugin
  function generateLoaders (loaders) {
    var sourceLoader = loaders.map(function (loader) {
      var extraParamChar
      if (/\?/.test(loader)) {
        loader = loader.replace(/\?/, '-loader?')
        extraParamChar = '&'
      } else {
        loader = loader + '-loader'
        extraParamChar = '?'
      }
      return loader + (options.sourceMap ? extraParamChar + 'sourceMap' : '')
    }).join('!')

    return options.extract ? ExtractTextPlugin.extract('style-loader', sourceLoader) : ['style-loader', sourceLoader].join('!')
  }

  return {
    css: generateLoaders(['css', 'postcss']),
    less: generateLoaders(['css', 'less', 'postcss']),
    sass: generateLoaders(['css', 'sass?indentedSyntax', 'postcss']),
    scss: generateLoaders(['css', 'sass?config=scssLoaderConfig', 'postcss']),
    stylus: generateLoaders(['css', 'stylus', 'postcss']),
    styl: generateLoaders(['css', 'stylus', 'postcss'])
  }
}

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function (options) {
  var output = []
  var loaders = exports.cssLoaders(options)
  for (var extension in loaders) {
    var loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      loader: loader
    })
  }
  return output
}
