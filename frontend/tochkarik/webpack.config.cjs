const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const fs = require('fs');
const dotenv = require('dotenv');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin'); // Импорт плагина


dotenv.config({path: 'frontend/.env'});

const keyPath = path.resolve(__dirname, 'frontend/ssl/selfsigned.key');
const certPath = path.resolve(__dirname, 'frontend/ssl/selfsigned.crt');

const httpsConfig = fs.existsSync(keyPath) && fs.existsSync(certPath) ? {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath),
} : false;

module.exports = {
    entry: './src/main.tsx',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
    },
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react'],
                    },
                },
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html',
            filename: 'index.html',
        }),
        new webpack.DefinePlugin({
            'process.env': {
                VITE_API_URL: JSON.stringify(process.env.VITE_API_URL),
            },
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, 'node_modules/leaflet/dist/images'),
                    to: 'images/leaflet',
                },
            ],
        }),
    ],
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        compress: true,
        port: 5173,
        https: httpsConfig,
        host: '0.0.0.0',
        hot: true,
        historyApiFallback: true,
    },
};
