var path = require('path');
var webpack = require('webpack');

var nodeEnv = process.env.NODE_ENV || 'development';
var isProd = nodeEnv === 'production';

module.exports = {
    devtool: isProd ? 'cheap-module-source-map' : 'eval',    // webpack --devtool eval
    entry: {
        app: './App/index.js'
    },
    output: {
        path: path.join(__dirname, '/public/javascripts/'),
        filename: '[name].bundle.js'
    },
    resolve: {
        // 后缀自动补全
        modulesDirectories: [path.join(__dirname, 'node_modules')],
        extensions: ['', '.js', '.jsx']
    },
    module: {
        externals: {
            //don't bundle the 'react' npm package with our bundle.js
            //but get it from a global 'React' variable
            'react': 'React',
            'react-dom': 'ReactDOM',
        },
        loaders: [
            {
                test:    /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader:  'babel',
                query:   {
                    presets: ['es2015', 'react', 'stage-0'],
                    plugins: ['add-module-exports', 'typecheck']
                }
            },
            { test: /\.css$/, exclude: /\.useable\.css$/, loader: "style!css" },
            { test: /\.useable\.css$/, loader: "style/useable!css" },
            {
                test: /\.scss$/,
                loader: "style!css!sass"
            }
        ]
    },
    babel: {
        plugins: ['antd', {
            style: 'css', // if true, use less
        }]
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            sourceMap: false
        }),
        new webpack.DefinePlugin({
            'process.env': { NODE_ENV: JSON.stringify(nodeEnv) }
        })
    ]
};
