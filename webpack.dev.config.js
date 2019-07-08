module.exports = {
    mode: 'development',
    entry: './public/js/script.js',
    output: {
        filename: 'library.bundle.js',
        path: __dirname + '/public/dist'
    },
    module: {
        rules: [
            { 
                test: /\.css$/, 
                use: [ 'style-loader', 'css-loader' ]
                //exclude: /node_modules/
            }
        ]
    }
}