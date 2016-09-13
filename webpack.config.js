const webpack = require('webpack');

module.exports = {
    entry: "./src/js/index.js",
    output: {
        path: __dirname,
        filename: "bundle.js"
    },
    resolve: {
        alias: {
           handlebars: 'handlebars/dist/handlebars.min.js'
        }
    },
    
    plugins: [
        new webpack.IgnorePlugin(/\.\/locale/),
        new webpack.DefinePlugin({
        	__PATH__: '"./data.json"'
        })
    ]
};
