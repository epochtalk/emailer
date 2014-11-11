/* jshint node: true */
'use strict';

var fs = require('fs');
var path = require('path');
var Hapi = require('hapi');
var Good = require('good');
var GoodConsole = require('good-console');
var config = require(path.join(__dirname, 'config'));
var routes = require(path.join(__dirname, 'route'));

var socketPath = config.socketPath;

var cleanupSocket = function() {
  if (fs.existsSync(socketPath)) {
    fs.unlinkSync(socketPath);
  }
};

cleanupSocket();

var server = Hapi.createServer(socketPath);
server.route(routes);

var goodPlugin = {
  plugin: Good,
  options: {
    reporters: [ { reporter: GoodConsole, args:[{ log: '*', request: '*', error: '*' }] } ]
  }
};

server.pack.register(goodPlugin, function (err) {
  if (err) { throw err; }
});

server.start(function () {
  server.log('info', 'Server started at: ' + server.info.uri);
});

process.on('SIGINT', function() {
  cleanupSocket();
  process.exit();
});

process.on('uncaughtException', function() {
  cleanupSocket();
  process.exit();
});

exports.start = function() {
  cleanupSocket();
  server.start();
};

exports.stop = function() {
  server.stop();
  cleanupSocket();
};