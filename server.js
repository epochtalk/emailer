/* jshint node: true */
'use strict';

var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var Hapi = require('hapi');
var Good = require('good');
var GoodConsole = require('good-console');
var GoodFile = require('good-file');
var config = require(path.join(__dirname, 'config'));
var routes = require(path.join(__dirname, 'route'));

var socketPath = config.socketPath;

if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
  console.warn('Error starting Epoch Emailer. Environment variables for SMTP_HOST, SMTP_USER, and SMTP_PASS must be set.');
  process.exit();
}

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

if (config.logEnabled) {
  mkdirp.sync('./logs/operations');
  mkdirp.sync('./logs/errors');
  mkdirp.sync('./logs/requests');
  var logOpts = { extension: 'log', rotationTime: 1, format: 'YYYY-MM-DD-X' };
  var reporters = goodPlugin.options.reporters;
  reporters.push({ reporter: GoodFile, args: ['./logs/operations/', { ops: '*' }, logOpts] });
  reporters.push({ reporter: GoodFile, args: ['./logs/errors/', { error: '*' }, logOpts] });
  reporters.push({ reporter: GoodFile, args: ['./logs/requests/', { request: '*' }, logOpts] });
}

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