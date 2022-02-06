"use strict"


const path = require("path")
const webpack = require("webpack")

module.exports = (env, argv) => {
  let config = {
    mode: argv.mode,
    entry: {
      "popup": './src/popup.ts',
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    node: { global: false },
    cache: true,
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
      path: `${path.resolve(__dirname, 'extension/js')}`,
      publicPath: '/',
      filename: "[name].js"
    },
  }

  if (argv.mode !== 'production' ) {
    config.devtool = 'inline-source-map'
  }

  return config
}
