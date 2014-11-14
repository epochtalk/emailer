/* jshint node: true */
'use strict';

var path = require('path');
var doT = require('dot');
var fs = require('fs');
var joi = require('joi');
var config = require(path.join(__dirname, 'config'));

exports.recoverAccount = {
  schema: {
    username: joi.string().min(1).max(255).required(),
    reset_url: joi.string().required(),
    email: joi.string().email().required()
  },
  compile: function (params) {
    var template = doT.template(fs.readFileSync(__dirname + '/templates/recover-account.html'));
    return {
      from: config.senderEmail,
      to: params.email,
      subject: '[EpochTalk] Account Recovery',
      html: template({ username: params.username, resetUrl: params.reset_url })
    };
  }
};
