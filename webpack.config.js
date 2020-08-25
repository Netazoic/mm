var webpack = require('webpack')
var path = require('path')
var ExtractTextPlugin = require("extract-text-webpack-plugin")

var PROD = (process.env.NODE_ENV === 'production')
var DEV = (process.env.NODE_ENV === 'development')
var DEVHR = (process.env.NODE_ENV === 'dev_hr')

module.exports = {
    entry: './src/main.js',
    output: {
        path: PROD ? path.resolve(__dirname, './dist/prd') 
        		: DEV 
        			? path.resolve(__dirname, './dist/dev') 
        			: path.resolve(__dirname, './dist'),
// publicPath: '/dist/',
        publicPath:
            PROD
                ? '/app/mm/dist/prd'
                : DEV
                	? '/app/mm/dist/dev'  // standard development, devw
                	: '/dist',    // hot-reload, devhr
        filename: PROD ? 'mm.min.js' : 'mm.js',
        // https://github.com/webpack/webpack/issues/3929
        library: undefined,
        libraryTarget: 'umd'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'vue-style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    'vue-style-loader',
                    'css-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.sass$/,
                use: [
                    'vue-style-loader',
                    'css-loader',
                    'sass-loader?indentedSyntax'
                ]
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        'scss': PROD ? ExtractTextPlugin.extract({
                            use: ['css-loader', 'sass-loader'],
                            fallback: 'vue-style-loader'
                        }) : [
                            'vue-style-loader',
                            'css-loader',
                            'sass-loader'
                        ],
                        'sass': PROD ? ExtractTextPlugin.extract({
                            use: ['css-loader', 'sass-loader?indentedSyntax'],
                            fallback: 'vue-style-loader'
                        }) : [
                            'vue-style-loader',
                            'css-loader',
                            'sass-loader?indentedSyntax'
                        ]
                    }
                }
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]?[hash]'
                }
            }
        ]
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        },
        extensions: ['*', '.js', '.vue', '.json']
    },
    devServer: {
        historyApiFallback: true,
        noInfo: true,
        overlay: true
    },
    performance: {
        hints: false
    },
    devtool: '#eval-source-map'
}

if (DEV) {
	module.exports.devtool = '#source-map'
}

if (PROD) {
    module.exports.devtool = '#source-map'
    // http://vue-loader.vuejs.org/en/workflow/production.html
    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
            compress: {
                warnings: false
            }
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true
        }),
        new ExtractTextPlugin('style.css')
    ])
}
