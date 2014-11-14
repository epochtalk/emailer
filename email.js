/* jshint node: true */
'use strict';

var path = require('path');
var doT = require('dot');
var fs = require('fs');
var joi = require('joi');
var config = require(path.join(__dirname, 'config'));

var templateFile = function(filename) {
  return fs.readFileSync(path.join(__dirname, 'templates', filename));
};

exports.recoverAccount = {
  schema: {
    username: joi.string().min(1).max(255).required(),
    reset_url: joi.string().required(),
    email: joi.string().email().required()
  },
  compile: function(params) {
    var template = doT.template(templateFile('recover-account.html'));
    return {
      from: config.senderEmail,
      to: params.email,
      subject: '[EpochTalk] Account Recovery',
      html: template({ username: params.username, resetUrl: params.reset_url })
    };
  }
};

exports.recoverSuccess = {
  schema: {
    username: joi.string().min(1).max(255).required(),
    forum_url: joi.string().required(),
    email: joi.string().email().required()
  },
  compile: function(params) {
    var template = doT.template(templateFile('recover-success.html'));
    return {
      from: config.senderEmail,
      to: params.email,
      subject: '[EpochTalk] Account Recovery Success',
      html: template({ username: params.username, forumUrl: params.forum_url })
    };
  }
};

exports.confirmAccount = {
  schema: {
    username: joi.string().min(1).max(255).required(),
    confirm_url: joi.string().required(),
    email: joi.string().email().required()
  },
  compile: function(params) {
    var template = doT.template(templateFile('confirm-account.html'));
    return {
      from: config.senderEmail,
      to: params.email,
      subject: '[EpochTalk] Account Confirmation',
      html: template({ username: params.username, confirmUrl: params.confirm_url })
    };
  }
};