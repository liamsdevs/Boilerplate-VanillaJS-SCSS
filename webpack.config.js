const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const fs = require('fs');

function getHtmlPlugins(sourcePath) {
    let files = fs.readdirSync(sourcePath, { withFileTypes: true });
    let htmlFiles = [];

    files.forEach(file => {
        if (file.isDirectory()) {
            htmlFiles = [...htmlFiles, ...getHtmlPlugins(path.join(sourcePath, file.name))];
        } else if (file.name.endsWith('.html') && file.name !== 'index.html' && file.name !== '404.html') {
            htmlFiles.push(new HtmlWebpackPlugin({
                template: path.join(sourcePath, file.name),
                filename: path.join('views', file.name),
            }));
        }
    });

    return htmlFiles;
}

module.exports = {
    entry: "./src/js/main.js",
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html',
        }),
        new HtmlWebpackPlugin({
            template: './src/404.html',
            filename: '404.html',
        }),
        ...getHtmlPlugins(path.resolve(__dirname, 'src')),
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css',
        }),
    ],
    devServer: {
        static: {
            directory: path.join(__dirname, 'src'),
        },
        compress: true,
        host: "0.0.0.0",
        port: 8080,
        open: true,
        hot: true,
    },
};