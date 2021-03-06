#Emailer

Email server for [EpochTalk Frontend](http://github.com/epochtalk/frontend).

## Installation and Configuration

1) Checkout repository using git:
```sh
$ git clone git@github.com:epochtalk/emailer.git
```

2) Change directories and install dependencies using [npm](https://www.npmjs.org/doc/README.html)
```sh
$ cd emailer
$ npm install
```

3) Add and set the following configs to a `.env` file.
```sh
SMTP_HOST=smtp.example.com
SMTP_USER=info@example.com
SMTP_PASS=password
```

4) Run the server using [foreman](http://ddollar.github.io/foreman/)
```sh
$ foreman start -f Profile
```
##Adding Templates
* Create an html template using [doT](http://olado.github.io/doT/index.html) notation for parameters
* Place html file in `/templates` folder
* Add export for new template to `emails.js`

###Example

**Add Template File** (`templates/recover-account.html`)
```html
  <h3>Account Recovery</h3>
  Recover your account by visiting the link below and resetting your password:<br /><br />
  <strong>Username</strong>: {{=it.username}}<br />
  <strong>Password</strong>:
  <a href="{{=it.resetUrl}}">Reset</a>
```

**Add Template Export to** `email.js`
```js
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
  reset_url: 'http://localhost:8080/reset/john/123412412412412',
};

request.post({ url:'http://unix:/tmp/epochEmailer.sock:/recoverAccount', formData: params }, function(err, res, body) {
  if (body.statusCode === 200) {
    console.log(body.message); // success
  }
});
```