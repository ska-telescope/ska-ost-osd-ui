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
      maxAssetSize: 512000,
    },

    resolve: {
      extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
      fallback: {
        assert: false,
        util: false,
        crypto: false,
        vm: false,
        net: false,
        tls: false,
        stream: false,
        zlib: false,
        buffer: require.resolve('buffer'),
      },
    },

    devServer: {
      port: 8090,
      historyApiFallback: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
      },
    },

    module: {
      rules: [
        {
          test: /\.m?js|\.jsx/,
          type: 'javascript/auto',
          resolve: {
            fullySpecified: false,
          },
        },
        {
          test: /\.s[ac]ss$/i,
          use: ['style-loader', 'css-loader', 'sass-loader'],
        },
        {
          test: /\.json$/,
          loader: 'json-loader',
        },
        {
          test: /\.(ts|tsx|js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
          },
        },
      ],
    },

    devtool: 'source-map',

    plugins: [
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
      }),
      new webpack.ProvidePlugin({
        process: 'process/browser',
      }),
      new webpack.DefinePlugin({
        'process.env.VERSION': JSON.stringify(process.env.npm_package_version),
      }),
      new ModuleFederationPlugin({
        name: 'osd',
        filename: 'remoteEntry.js',
        remotes: {},
        exposes: {
          './osd': './src/components/Routing/Routing.tsx',
        },
        shared: {
          ...deps,
          react: {
            eager: true,
            singleton: true,
            requiredVersion: deps['react'],
          },
          axios: { singleton: true, requiredVersion: '^1.5.1', eager: true },
          'react-dom': {
            eager: true,
            singleton: true,
            requiredVersion: deps['react-dom'],
          },
          'react-json-view': {
            eager: true,
            singleton: true,
            requiredVersion: deps['react-json-view'],
          },
          'react-router-dom': {
            eager: true,
            singleton: true,
            requiredVersion: deps['react-router-dom'],
          },
          kafkajs: {
            eager: true,
            singleton: true,
            requiredVersion: deps['kafkajs'],
          },

          // i18n
          i18next: {
            eager: true,
            // singleton: true,
            requiredVersion: deps.i18next,
          },
          'react-i18next': {
            eager: true,
            // singleton: true,
            requiredVersion: deps['react-i18next'],
          },
          'i18next-browser-languagedetector': {
            eager: true,
            singleton: true,
            requiredVersion: deps['i18next-browser-languagedetector'],
          },
          'i18next-http-backend': {
            eager: true,
            // singleton: true,
            requiredVersion: deps['i18next-http-backend'],
          },
          // Material UI
          '@mui/material': { singleton: true, requiredVersion: deps['@mui/material'], eager: true },
          '@mui/icons-material': {
            singleton: true,
            requiredVersion: deps['@mui/icons-material'],
            eager: true,
          },
          // SKAO components
          '@ska-telescope/ska-gui-components': {
            requiredVersion: deps['@ska-telescope/ska-gui-components'],
            eager: true,
          },
          '@ska-telescope/ska-gui-local-storage': {
            requiredVersion: deps['@ska-telescope/ska-gui-local-storage'],
            eager: true,
          },
          // mixture
          '@emotion/react': {
            singleton: true,
            requiredVersion: deps['@emotion/react'],
            eager: true,
          },
          '@emotion/styled': {
            singleton: true,
            requiredVersion: deps['@emotion/styled'],
            eager: true,
          },
          moment: {
            eager: true,
            singleton: true,
            requiredVersion: deps.moment,
          },
        },
      }),
      new HtmlWebPackPlugin({
        template: './public/index.html',
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: 'public',
            globOptions: {
              dot: true,
              gitignore: true,
              ignore: ['**/*.html'],
            },
          },
        ],
      }),
    ],
  };
};
