module.exports = {
    mode: 'production',
    entry: './public/js/script.js',
    output: {
        filename: 'library-[contentHash].bundle.js',
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