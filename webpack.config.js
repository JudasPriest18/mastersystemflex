const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const { template } = require('lodash')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const { userInfo } = require('os')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const isDev = process.env.NODE_ENV === 'development'
const isProd = !isDev
const TerserWebpackPlugin = require('terser-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
var ExtractTextPlugin = require ('extract-text-webpack-plugin')

console.log('IS DEV:', isDev)

const optimization = () => {
    const config = {
        splitChunks: {
            chunks:'all'
        }
    }

    if (isProd)  {
        config.minimizer = [
           new OptimizeCssAssetsPlugin(),
           new TerserWebpackPlugin()
        ]
    }

    return config
}

const filename = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`
    
module.exports = {
    context: path.resolve(__dirname, 'src'),
    entry: {
        main: './index.js',
    },
    output: {
        filename: filename('js'),
        path: path.resolve(__dirname, 'dist')
    }, 

     optimization: optimization(),
    
     devServer: {
        contentBase: path.join(__dirname, 'dist'),
        port: 4200,
    },
    
    plugins: [
        new HTMLWebpackPlugin({
            template: './index.html',
            minify:{
                collapseWhitespace: isProd
            }
        }),
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
        patterns:[
            {
                from: path.resolve(__dirname, 'src/favicon.ico'),
                to: path.resolve(__dirname,'dist'),
                from: path.resolve(__dirname, 'src/assets'),
                to: path.resolve(__dirname,'dist/assets')
            }

        ]}),
        new MiniCssExtractPlugin({
            filename: filename('css'),
          }),
    ],
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [
                    {
                      loader: MiniCssExtractPlugin.loader,
                      options: {
                        publicPath: './',
                      },
                    },
                    'css-loader',
                  ],
            },
            {
                test: /\.less$/i,
                use: [
                    {
                      loader: MiniCssExtractPlugin.loader,
                      options: {
                        publicPath: './',
                      },
                    },
                    'css-loader',
                    'less-loader'
                  ],
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    {
                      loader: MiniCssExtractPlugin.loader,
                      options: {
                        publicPath: './',
                      },
                    },
                    'css-loader',
                    'sass-loader'
                  ],
            },
            {
                test: /\.(png|jpg|svg|gif)$/i,
                use: "file-loader?name=/assets/[name].[ext]",
            },
            {
                test: /\.(ttf|waff|waff2|eot)$/,
                use: ['file-loader']
            }
        ]
    }
}
