const webpack = require('webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const deps = require('./package.json').dependencies;

module.exports = () => {
  return {
    entry: './src/index.jsx',
    output: {},

    performance: {
      hints: false,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000
    },

    resolve: {
      extensions: ['.tsx', '.ts', '.jsx', '.js', '.json']
    },

    devServer: {
      port: 8090,
      historyApiFallback: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
      }
    },

    module: {
      rules: [
        {
          test: /\.m?js|\.jsx/,
          type: 'javascript/auto',
          resolve: {
            fullySpecified: false
          }
        },
        {
          test: /\.s[ac]ss$/i,
          use: ['style-loader', 'css-loader', 'sass-loader']
        },
        {
          test: /\.json$/,
          loader: 'json-loader'
        },
        {
          test: /\.(ts|tsx|js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader'
          }
        }
      ]
    },

    devtool: 'source-map',

    plugins: [
      new webpack.DefinePlugin({
        'process.env.VERSION': JSON.stringify(process.env.npm_package_version)
      }),
      new ModuleFederationPlugin({
        name: 'reactSkeleton',
        filename: 'remoteEntry.js',
        remotes: {
          counterStore: 'counterStore@http://localhost:8094/remoteEntry.js'
        },
        exposes: {
          './ReactSkeleton': './src/components/ReactSkeleton/ReactSkeleton.tsx'
        },
        shared: {
          ...deps,
          react: {
            eager: true,
            singleton: true,
            requiredVersion: deps['react']
          },
          'react-dom': {
            eager: true,
            singleton: true,
            requiredVersion: deps['react-dom']
          },
          // i18n
          i18next: {
            eager: true,
            // singleton: true,
            requiredVersion: deps.i18next
          },
          'react-i18next': {
            eager: true,
            // singleton: true,
            requiredVersion: deps['react-i18next']
          },
          'i18next-browser-languagedetector': {
            eager: true,
            singleton: true,
            requiredVersion: deps['i18next-browser-languagedetector']
          },
          'i18next-http-backend': {
            eager: true,
            // singleton: true,
            requiredVersion: deps['i18next-http-backend']
          },
          // Material UI
          '@mui/material': { singleton: true, requiredVersion: deps['@mui/material'], eager: true },
          // Redux
          'react-redux': { singleton: true, requiredVersion: deps['react-redux'], eager: true },
          redux: { singleton: true, requiredVersion: deps['redux'], eager: true },
          '@reduxjs/toolkit': {
            singleton: true,
            requiredVersion: deps['@reduxjs/toolkit'],
            eager: true
          },
          'redux-saga': { singleton: true, requiredVersion: deps['redux-saga'], eager: true },
          'redux-localstorage-simple': {
            singleton: true,
            requiredVersion: deps['redux-localstorage-simple'],
            eager: true
          },
          'redux-dynamic-middlewares': {
            singleton: true,
            requiredVersion: deps['redux-dynamic-middlewares'],
            eager: true
          },
          // SKAO components
          '@ska-telescope/ska-gui-components': {
            requiredVersion: deps['@ska-telescope/ska-gui-components'],
            eager: true
          },
          // mixture
          '@emotion/react': {
            singleton: true,
            requiredVersion: deps['@emotion/react'],
            eager: true
          },
          '@emotion/styled': {
            singleton: true,
            requiredVersion: deps['@emotion/styled'],
            eager: true
          },
          moment: {
            eager: true,
            singleton: true,
            requiredVersion: deps.moment
          }
        }
      }),
      new HtmlWebPackPlugin({
        template: './public/index.html'
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: 'public',
            globOptions: {
              dot: true,
              gitignore: true,
              ignore: ['**/*.html']
            }
          }
        ]
      })
    ]
  };
};
