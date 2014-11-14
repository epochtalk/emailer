/* jshint node: true */
'use strict';

var path = require('path');
var hapi = require('hapi');
var joi = require('joi');
var heckler = require('heckler');
var emailTemplates = require(path.join(__dirname, 'email'));

module.exports = {
  method: 'POST',
  path: '/{template_name}',
  config: {
    handler: function(request, reply) {
      var badRequest = function (msg) {
        reply(hapi.error.badRequest(msg));
      };

      var templateName = request.params.template_name;
      var email = emailTemplates[templateName];
      if (!email) { return badRequest(templateName + ' is not a valid template'); }

      var validate = joi.validate(request.payload, email.schema);
      if (validate.error) { return badRequest(validate.error); }

      var template = email.compile(request.payload);
      heckler.email(template, function(err) {
        if (err) { return badRequest(err.message); }
        reply({ statusCode: 200, message: 'Email successfully sent'});
      });
    },
    validate: { params: { template_name: joi.string().required() } }
  }
};