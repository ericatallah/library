module.exports = {
    entry: './public/js/script.js',
    output: {
        path: __dirname + '/public/dist',
        filename: 'bundle.js'
    },
    module: {
        rules: [
            { 
                test: /\.css$/, 
                use: [ 'style-loader', 'css-loader' ],
                exclude: /node_modules/
            }
        ]
    }
}