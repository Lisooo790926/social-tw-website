const HtmlWebpackPlugin = require('html-webpack-plugin')
// const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin')
const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const webpack = require('webpack')

module.exports = (env) => ({
    entry: ['./src/index.tsx'],
    mode: 'development',
    devServer: {
        port: 3000,
        historyApiFallback: true,
        allowedHosts: 'all',
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
            automaticNameDelimiter: '-',
        },
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        publicPath: '/',
    },
    resolve: {
        extensions: ['.*', '.js', '.jsx', '.json', '.scss', '.ts', '.tsx'],
        fallback: {
            path: require.resolve('path-browserify'),
            crypto: require.resolve('crypto-browserify'),
            assert: require.resolve('assert/'),
            stream: require.resolve('stream-browserify'),
            os: require.resolve('os-browserify/browser'),
            events: require.resolve('events/'),
            fs: false,
            readline: false,
            constants: false,
        },
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-react'],
                        },
                    },
                    {
                        loader: 'ts-loader',
                    },
                ],
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-react'],
                },
            },
            {
                test: /\.(png|jpg|gif|ico)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            esModule: false,
                            limit: 8192,
                        },
                    },
                ],
            },
            {
                test: /\.(css)$/,
                // exclude: /node_modules/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                ],
            },
            {
                test: /\.svg$/i,
                issuer: /\.[jt]sx?$/,
                use: [
                    {
                        loader: '@svgr/webpack',
                        options: {
                            svgoConfig: {
                                plugins: [
                                    'removeDimensions',
                                    {
                                        name: 'convertColors',
                                        params: {
                                            currentColor: true,
                                        },
                                    },
                                ],
                            },
                        },
                    },
                ],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'public/index.html',
            filename: 'index.html',
            inlineSource: '.(js|css)',
            favicon: 'public/favicon.ico',
        }),
        new MiniCssExtractPlugin(),
        // new HtmlWebpackInlineSourcePlugin(),
        new webpack.DefinePlugin({
            'process.env': {},
            'process.argv': [],
            'process.versions': {},
            'process.versions.node': '"12"',
            process: {
                exit: '(() => {})',
                browser: true,
                versions: {},
                cwd: '(() => "")',
            },
            ...(env.CYPRESS
                ? {
                      ['process.env.CYPRESS']: 'true',
                  }
                : {}),
        }),
        new webpack.ProvidePlugin({
            Buffer: path.resolve(__dirname, 'externals', 'buffer.js'),
        }),
        new webpack.ContextReplacementPlugin(/\/maci\-crypto\//, (data) => {
            delete data.dependencies[0].critical
            return data
        }),
    ],
})
