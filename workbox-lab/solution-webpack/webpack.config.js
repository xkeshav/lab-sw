const path = require('path');
const WorkboxPlugin = require('workbox-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].js',
  },
  plugins: [
    new WorkboxPlugin({
      globDirectory: './',
      globPatterns: ['**\/*.{html,js,css}'],
      globIgnores: ['admin.html', 'node_modules/**', 'service-worker.js',
        'webpack.config.js', 'src/**', 'build/**'],
      swSrc: './src/service-worker.js',
      swDest: './service-worker.js',
    })
  ],
  resolve: {
    modules: ['node_modules'],
    extensions: ['.js', '.json', '.jsx', '.css']
  }
};
