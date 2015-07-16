'use strict'; 

var app = require('express')();
var path = require('path');

app.use(require('./logging.middleware'));

app.use(require('./sass.middleware'));

app.use(require('./requestState.middleware'));

app.use(require('./statics.middleware'));

var User = require('../api/users/user.model');
app.post('/auth/login', function (req, res, next) {
	// find user by email and password
	// if they exist send them back to the frontend
	// if they don't error 401
	User.findOne(req.body).exec()
	.then(function (user) {
		if (user) res.json(user);
		// did not find user
		else {
			var err = new Error('Not Authenticated');
			err.status = 401;
			next(err);
		}
	})
	// error with query/db
	.then(null, next);
});

app.use('/api', require('../api'));

app.get('/*', function (req, res) {
	var index = path.join(__dirname, '..', '..', 'public', 'index.html');
	res.sendFile(index);
});

app.use(require('./error.middleware'));

module.exports = app;