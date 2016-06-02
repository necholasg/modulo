var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var path = require('path');
var merge = require('webpack-merge');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var NpmInstallPlugin = require('npm-install-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');

var TARGET = process.env.npm_lifecycle_event;

var PATHS = {
  app: path.join(__dirname, 'app'),
  public: path.join(__dirname, 'public'),
  style: path.join(__dirname, 'style/main.scss')
};

const ENV = {
  host: process.env.HOST || 'localhost',
  port: process.env.PORT || 8080
};

var common = {
  entry: {
    app: './app/index.js',
    style: PATHS.style
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  output: {
    path: PATHS.public,
    filename: '[name].js',
    publicPath: ''
  },
  module: {
    loaders: [
      {
        exclude: /node_modules/,
        test: /\.jsx?$/,
        loader: 'babel-loader?presets[]=es2015&presets[]=react&presets[]=stage-1',
        include: PATHS.app
      },
      {
        test: /\.(png|jpg|gif|jpeg|svg)$/,
        loader: 'url-loader?limit=8192'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Redux-server Project Template',
      template: 'app/index.html'
    })
  ]
};

if(TARGET === 'start') {
  module.exports = merge(common, {
    devtool: 'eval-source-map',
    devServer: {
      historyApiFallback: true,
      contentBase: './public',
      hot: true,
      inline: true,
      progress: true,
      stats: 'errors-only',
      proxy: {
        "/socket.io/*": {
          target:'http://localhost:3000',
          secure: false
        },
        "/api/*": {
          target:'http://localhost:3000',
          secure: false
        }
      }
    },
    module: {
      loaders: [
        {
          test: /\.scss$/,
          loaders: ['style', 'css','sass']
        }
      ]
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new NpmInstallPlugin({
        save: true //--save
      })
    ]
  });
} else {
  module.exports = merge(common, {
    module: {
      loaders: [
        {
          test: /\.scss$/,
          loader: ExtractTextPlugin.extract("style", "css!sass"),
          include: PATHS.style
        }
      ]
    },
    plugins: [
      // Output extracted CSS to a file
      new ExtractTextPlugin('[name].css'),
      new webpack.optimize.CommonsChunkPlugin({
          names: ['manifest']
      }),
      new CleanWebpackPlugin([PATHS.public]),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        }
      }),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.OccurrenceOrderPlugin(),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': '"production"'
      })
    ]
  });
}
