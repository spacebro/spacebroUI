const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
var config = require('./webpack.config.js')

const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 9050

var compiler = webpack(config)
var server = new WebpackDevServer(compiler, {
  hot: true,
  inline: true,
  historyApiFallback: true,
  stats: {
    colors: true
  }
})
server.listen(port, host, function () {
  console.log(`Server listening at http://${host}:${port}`)
})
