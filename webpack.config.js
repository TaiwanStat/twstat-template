var jsx_src = './mudslide/js/src/';
var jsx_dist = './mudslide/js/dist/';
var lib_src = './node_modules';

var webpack = require('webpack');

module.exports = {
    entry: {
        'index': jsx_src + 'index.jsx',
        'common': [
            lib_src + '/react/react.js',
            lib_src + '/react-dom/index.js',
            lib_src + '/jquery/dist/jquery.js',
	    lib_src + '/material-design-lite/material.js',
            lib_src + '/material-design-lite/material.css',
            lib_src + '/d3/index.js',
            lib_src + '/leaflet/dist/leaflet.js',
            lib_src + '/leaflet/dist/leaflet.css'
        ]
    },
    output: {
        filename: '[name].min.js',
        path: jsx_dist,
        publicPath: '/mudslide/js/dist/'
    },
    module: {
        loaders: [
            { test: /\.jsx$/, loader: 'jsx-loader?harmony!babel' },
            { test: /\.css$/, loader: 'style-loader!css-loader' },
            { test: /\.png$/, loader: "url-loader?limit=100000" }
        ]
    },
/*    externals: {
        'react': 'React',
        'd3': 'd3'
    },
*/
    resolve: {
        extensions: ['', '.js', '.jsx', '.css', '.min.css', '.min.js']
    },
    //plugins: [commonsPlugin, minifyPlugin]
    plugins: [
      new webpack.optimize.CommonsChunkPlugin('common', 'common.min.js')
    ]
}
