#Emailer

Email server for EpochTalk Frontend.

##Adding Templates
* Create an html template using [doT](http://olado.github.io/doT/index.html) notation for parameters
* Place html file in `/templates` folder
* Add export for new template to `emails.js`

###Example

**Add Template File** (`recover-account.html`)
```html
    <h3>Account Recovery</h3>
    Recover your account by visiting the link below and resetting your password:<br /><br />
    <strong>Username</strong>: {{=it.username}}<br />
    <strong>Password</strong>:
    <a href="{{=it.rootUrl}}/reset/{{=it.username}}/{{=it.resetToken}}">Reset</a>
```

**Add Template Export to** `email.js`
```js
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
```
* `schema` - validation schema for email template params
* `compile` - returns email object with compiled template

**Call Server**

Call the emailer server using a library that supports unix domain sockets like request.
```js
var request = require('request');

var params = {
  username: 'john',
  email: 'john@example.com',
  reset_token: '1a2B3c4D5E6F7h8HhI0j',
};

request.post({ url:'http://unix:/tmp/epochEmailer.sock:/recoverAccount', formData: params }, function(err, res, body) {
  if (body.statusCode === 200) {
    console.log(body.message); // success
  }
});
```