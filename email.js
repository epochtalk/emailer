/* jshint node: true */
'use strict';

var path = require('path');
var doT = require('dot');
var fs = require('fs');
var Joi = require('joi');
var config = require(path.join(__dirname, 'config'));

exports.recoverAccount = {
  schema: {
    username: Joi.string().min(1).max(255).required(),
    reset_token: Joi.string().token().length(20).required(),
    email: Joi.string().email().required()
  },
  compile: function (params) {
    var template = doT.template(fs.readFileSync(__dirname + '/templates/recover-account.html'));
    return {
      from: config.senderEmail,
      to: params.email,
      subject: '[EpochTalk] Account Recovery',
      html: template({ username: params.username, rootUrl: config.hostUrl, resetToken: params.resetToken})
    };
  }
};
