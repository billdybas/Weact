// Example Configuration
var config = {
  BABEL_CACHE_DIRECTORY: false,
  BABEL_PLUGINS: [],
  BABEL_PRESETS: ['stage-0', 'es2015', 'react'],
  DEV_SERVER_URL: 'http://localhost:3000',
  DEVTOOL_CONFIG: {
    devtoolModuleFilenameTemplate: undefined,
    devtoolFallbackModuleFilenameTemplate: undefined
  },
  ENTRYPOINT: './src',
  OUTPUT_FILENAME: 'bundle.js',
  OUTPUT_PATH: 'assets',
  PUBLIC_PATH: '/assets/',
  SKIP_SOURCEMAPS: false,
  SOURCEMAP_TYPE: 'cheap-module-eval-source-map'
};

var path = require('path');
var webpack = require('webpack');

var webpackConfig = {
  devtool: config.SKIP_SOURCEMAPS ? undefined : config.SOURCEMAP_TYPE, // Sourcemap generation
  entry: [
    require.resolve('webpack-dev-server/client') + '?' + config.DEV_SERVER_URL, // webpack-dev-server
    require.resolve('webpack/hot/only-dev-server'), // For hot-module-replacement - won't reload the page if an update fails
    config.ENTRYPOINT // Source code entrypoint
  ],
  output: {
    path: path.join(__dirname, config.OUTPUT_PATH), // Path where output files will be placed
    publicPath: config.PUBLIC_PATH, // Public URL address of the output files when referenced in a browser
    filename: config.OUTPUT_FILENAME // Output file's name
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.json'] // e.g. require('config') instead of require('config.json')
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/, // .js and .jsx
        exclude: /node_modules/, // Don't pass 'node_modules' through these loaders; alternatively, 'include' a specific path
        loaders: ['react-hot', 'babel?' + _buildBabelQueryString()] // Passes through Babel (using any defined presets and plugins) then React Hot Loader
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(), // For hot-module-replacement
    new webpack.NoErrorsPlugin() // Prevents emitting assets when there are compiling errors
  ]
};
_processDevToolConfig();

// Adds DEVTOOL_CONFIG to webpackConfig if defined
// See: https://github.com/webpack/webpack/issues/559
function _processDevToolConfig() {
  var template = config.DEVTOOL_CONFIG.devtoolModuleFilenameTemplate;
  var fallbackTemplate = config.DEVTOOL_CONFIG.devtoolFallbackModuleFilenameTemplate;
  if (typeof template !== 'undefined') {
    webpackConfig.output.devtoolModuleFilenameTemplate = template; // See: https://webpack.github.io/docs/configuration.html#output-devtoolmodulefilenametemplate
  }
  if (typeof fallbackTemplate !== 'undefined') {
    webpackConfig.output.devtoolFallbackModuleFilenameTemplate = fallbackTemplate; // See: https://webpack.github.io/docs/configuration.html#output-devtoolfallbackmodulefilenametemplate
  }
}

// array = ['a', 'b', 'c'], param = 'example' becomes:
// example[]=a,example[]=b,example[]=c
// array = ['a'], param = 'example' becomes:
// example[]=a
function _buildArrayQueryString(array, param) {
  if (array.length === 0) {
    return '';
  }
  return param + '[]=' + array.join(',' + param + '[]=');
}

function _buildBabelQueryString() {
  var str = '';
  str += config.BABEL_CACHE_DIRECTORY ? 'cacheDirectory' : ''; // When set, will use the default OS temporary file directory to cache the results of the loader
  str += _buildArrayQueryString(config.BABEL_PRESETS, 'presets'); // Babel Presets
  str += _buildArrayQueryString(config.BABEL_PLUGINS, 'plugins'); // Babel Plugins
  return str;
}

module.exports = webpackConfig;
