/* jshint node: true */
'use strict';

var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var hapi = require('hapi');
var good = require('good');
var goodConsole = require('good-console');
var goodFile = require('good-file');
var config = require(path.join(__dirname, 'config'));
var routes = require(path.join(__dirname, 'route'));

var socketPath = config.socketPath;

if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
  var warning = 'Error starting Epoch Emailer. Environment variables for SMTP_HOST' +
    ', SMTP_USER, and SMTP_PASS must be set.';
  console.warn(warning);
  process.exit();
}

var cleanupSocket = function() {
  if (fs.existsSync(socketPath)) {
    fs.unlinkSync(socketPath);
  }
};

cleanupSocket();

var server = hapi.createServer(socketPath);
server.route(routes);

var goodPlugin = {
  plugin: good,
  options: {
    reporters: [ { reporter: goodConsole, args:[{ log: '*', request: '*', error: '*' }] } ]
  }
};

if (config.logEnabled) {
  mkdirp.sync('./logs/operations');
  mkdirp.sync('./logs/errors');
  mkdirp.sync('./logs/requests');
  var logOpts = { extension: 'log', rotationTime: 1, format: 'YYYY-MM-DD-X' };
  var reporters = goodPlugin.options.reporters;
  reporters.push({ reporter: goodFile, args: ['./logs/operations/', { ops: '*' }, logOpts] });
  reporters.push({ reporter: goodFile, args: ['./logs/errors/', { error: '*' }, logOpts] });
  reporters.push({ reporter: goodFile, args: ['./logs/requests/', { request: '*' }, logOpts] });
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