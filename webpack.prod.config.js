const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    mode: 'production',
    entry: {
        library: './public/js/script.js'
    },
    output: {
        filename: '[name].bundle.js',
        path: __dirname + '/public/dist'
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].bundle.css'
        })
    ],
    module: {
        rules: [
            { 
                test: /\.css$/, 
                use: [ MiniCssExtractPlugin.loader, 'css-loader' ]
                //exclude: /node_modules/
            }
        ]
    }
}