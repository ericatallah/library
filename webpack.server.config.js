const nodeExternals = require('webpack-node-externals');
const path = require('path');
//const HandlebarsPlugin = require('handlebars-webpack-plugin');
//const { isEqualHelper } = require('./helpers/helpers');

module.exports = {
    mode: 'development',
    target: 'node', 
    externals: [nodeExternals()], 
    entry: { 
        server: ['./app.js'] 
    }, 
    output: { 
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, './build'), 
    }, 
    plugins: [
        /*new HandlebarsPlugin({
            entry: './views/layouts/main.hbs',
            output: 'index.html',
            partials: ['./views/includes/header.hbs'],
            helpers: {
                isEqualHelper
            }
        })*/
    ],
    module: {
        rules: []
    }
}