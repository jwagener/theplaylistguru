var webpack = require('webpack');
var express = require('express');
var child_process = require('child_process');
var _ = require('underscore');
var app = express();
//var WebpackDevServer = require('webpack-dev-server');
var webpackConfig = require(process.env.NODE_ENV === "production" ? './webpack.config.prod' : './webpack.config.dev');
app.use(require('webpack-dev-middleware')(webpack(webpackConfig), {noInfo: true, publicPath: webpackConfig.output.publicPath}));

app.get('/lookup', function(request, response) {
  var isrcMap = {};
  var args = [];
  args.push('./tracks.csv');

  _.map(request.query.isrc, (isrc) => {
    isrcMap[isrc] = null;
    args.push(isrc);
  });

  var grep = child_process.spawn('./lookup.sh', args);
  grep.stdout.on('data', (data) => {
    var lines = data.toString().split("\n");
    _.map(lines, (line) => {
      var parts = line.split(':');
      isrcMap[ parts[0] ] = parts[1];
    })
  });

  grep.on('close', (code) => {
    response.json(isrcMap);
  });
});

app.get('/', function(request, response) {
  response.sendFile('index.html', {root: __dirname});
});

app.get('/playlist', function(request, response) {
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
