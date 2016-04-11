var webpack = require('webpack');
var express = require('express');
var app = express();
//var WebpackDevServer = require('webpack-dev-server');
var webpackConfig = require(process.env.NODE_ENV === "production" ? './webpack.config.prod' : './webpack.config.dev');
app.use(require('webpack-dev-middleware')(webpack(webpackConfig), {noInfo: true, publicPath: webpackConfig.output.publicPath}));

app.get('/', function(request, response) {
  response.sendFile('index.html', {root: __dirname});
});


var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log('Listening on ' + port + '...');
});
/*
new WebpackDevServer(webpack(webpackConfig), {
  publicPath: config.output.publicPath,
  hot: true,
  historyApiFallback: true
}).listen(port, 'localhost', function (err, result) {
  if (err) {
    return console.log(err);
  }
  console.log('Listening on ' + port + '...');
});*/
