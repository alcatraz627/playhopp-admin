const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = (env, options) => ({
    entry: './src/index.js',
    module: {
        rules: [{
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    // https://stackoverflow.com/questions/52541561/module-build-failed-from-node-modules-babel-loader-lib-index-js-error-cann
                    options: {
                        presets: ['@babel/preset-react']
                    },
                }
            },
            {
                test: /\.(sc|sa|c)ss$/,
                use: [{
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: options.mode == 'development'
                        }
                    },
                    // 'style-loader',
                    'css-loader',
                    'sass-loader',
                ]
            },
            {
                test: /\.(jp?eg|png|gif)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 10000
                    }
                }]
            },
            {
                test: /\.(eot|svg|ttf|woff2?|otf)$/,
                use: 'file-loader',
            }
        ]
    },
    resolve: {
        extensions: ['*', '.js', '.jsx'],
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin({}),
        new webpack.DefinePlugin({
            __MODE__: `"${options.mode}"`
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css',
            ignoreOrder: false,
        }),
    ],
    output: {
        path: __dirname + '/dist',
        publicPath: '/',
        filename: 'bundle.js',
        // filename: '[name].[hash].js',
    },
    // optimization: {
    //     splitChunks: {
    //         chunks: 'all'
    //     }
    // },
    devServer: {
        disableHostCheck: true,
        contentBase: './dist',
        hot: true,
        port: 9000,
        compress: true,
        historyApiFallback: true,
        // proxy: {
        //     '/api': {
        //         target: 'http://localhost:8000',
        //         changeOrigin: true,
        //     }
        // }
    }
})