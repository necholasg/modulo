/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__dirname) {'use strict';

	var express = __webpack_require__(1);
	var bodyParser = __webpack_require__(2);
	var http = __webpack_require__(3);
	var app = express();
	var router = __webpack_require__(4);
	var mongoose = __webpack_require__(7);
	var path = __webpack_require__(15);
	var compression = __webpack_require__(16);
	var TARGET = process.env.npm_lifecycle_event;
	var PORT = process.env.PORT || 3000;

	//DB Setup
	mongoose.connect('mongodb://heroku_25vmq1ql:nl3nl60mpepl6feaep1ee8kngj@ds023213.mlab.com:23213/heroku_25vmq1ql');

	//App setup
	app.use(compression());
	app.use(bodyParser.json({ type: '*/*' }));

	if (TARGET !== 'start') {
	  // serve our static stuff like index.css
	  app.use(express.static(path.join(__dirname, 'public')));
	  app.get('*', function (req, res) {
	    // and drop 'public' in the middle of here
	    res.sendFile('index.html', { root: path.join(__dirname, './public') });
	  });
	  var PORT = process.env.PORT || 5000;
	}

	router(app);

	var server = app.listen(PORT, function () {
	  if (PORT === 5000) {
	    console.log('Production Express server running at localhost:' + PORT);
	  } else {
	    console.log('Development Express server running at localhost:' + PORT);
	  }
	});

	var io = __webpack_require__(17).listen(server);
	var messages = [];
	var messageIndex = 0;
	var users = [];

	io.on('connection', function (socket) {

	  socket.emit('news', { msg: '\'Hello World!\' from server' });

	  socket.on('newUser', function (data) {
	    var inUsers = false;
	    if (users.length === 0) {
	      var new_user = {
	        name: data,
	        id: socket.id
	      };
	      users.push(new_user);
	      io.emit('allUsers', users);
	    } else {
	      for (var x in users) {
	        if (users[x].name === data) {
	          var inUsers = true;
	        }
	      }
	      if (inUsers === true) {
	        io.emit('allUsers', users);
	      } else {
	        var new_user = {
	          name: data,
	          id: socket.id
	        };
	        users.push(new_user);
	        io.emit('allUsers', users);
	      }
	    }
	  });

	  socket.on('msg', function (data) {
	    data.id = data.text + messageIndex;
	    messages[messageIndex] = data;
	    messageIndex++;
	    io.emit('msg', data);
	  });

	  socket.on('loggedOut', function () {
	    for (var x in users) {
	      if (users[x].id === socket.id) {
	        var index = users.indexOf(users[x].id);
	        users.splice(index, 1);
	      }
	    }
	    io.emit('allUsers', users);
	  });

	  socket.on('disconnect', function () {
	    for (var x in users) {
	      if (users[x].id === socket.id) {
	        var index = users.indexOf(users[x].id);
	        users.splice(index, 1);
	      }
	    }
	    io.emit('allUsers', users);
	  });

	  // A User starts a path
	  socket.on('startPath', function (data, sessionId) {

	    socket.broadcast.emit('startPath', data, sessionId);
	  });

	  // A User continues a path
	  socket.on('continuePath', function (data, sessionId) {

	    socket.broadcast.emit('continuePath', data, sessionId);
	  });

	  // Clear canvas
	  socket.on('clearBoard', function () {

	    io.sockets.emit('clearMe');
	  });
	});
	/* WEBPACK VAR INJECTION */}.call(exports, ""))

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = require("express");

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = require("body-parser");

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = require("http");

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Authentication = __webpack_require__(5);
	var passportService = __webpack_require__(11);
	var passport = __webpack_require__(12);

	var requireAuth = passport.authenticate('jwt', { session: false });
	var requireSignin = passport.authenticate('local', { session: false });

	module.exports = function (app) {

	  app.get('/api/secret', requireAuth, function (req, res) {

	    res.send({ message: 'super Secret code 8675309' });
	  });
	  app.post('/api/signin', requireSignin, Authentication.signin);
	  app.post('/api/signup', Authentication.signup);
	  app.get('/api/signout', function (req, res) {
	    console.log("LOGING OUT!!!");
	    res.json({ message: "signedOut" });
	  });
	  app.get('/test', function (req, res) {
	    res.send({ message: 'This is a test' });
	  });
	};

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var User = __webpack_require__(6);
	var jwt = __webpack_require__(9);
	var config = __webpack_require__(10);

	function tokenForUser(user) {
	  var timeStamp = new Date().getTime();
	  var username = user.username;
	  return jwt.encode({ sub: user.id, iat: timeStamp, username: username }, config.secret);
	}

	module.exports.signin = function (req, res, next) {
	  var token = tokenForUser(req.user);
	  //User has already had thier email and password auth'd
	  //We just need to give them a token
	  res.json({ token: token, username: req.user.username });
	};

	module.exports.signup = function (req, res, next) {
	  var email = req.body.email;
	  var password = req.body.password;
	  var username = req.body.username;

	  if (!email || !password || !username) {
	    return res.status(422).send({ error: "You must provide email and password" });
	  }
	  //see if a user with teh given email exists
	  User.findOne({ email: email }, function (err, existingUser) {
	    if (err) {
	      return next(err);
	    }

	    //if a user with email does exist, return an error
	    if (existingUser) {
	      return res.status(422).send({ error: 'Email is in use' });
	    }
	    //If a user with email does not exist, create and save user record
	    var user = new User({
	      email: email,
	      password: password,
	      username: username
	    });

	    user.save(function (err) {
	      if (err) {
	        return next(err);
	      }
	      var token = tokenForUser(user);
	      // Respond to request indicating the user was created
	      res.json({ token: token, username: user.username });
	    });
	  });
	};

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var mongoose = __webpack_require__(7);
	var Schema = mongoose.Schema;
	var bcrypt = __webpack_require__(8);

	//Define our model
	var userSchema = new Schema({
	  email: { type: String, unique: true, lowercase: true },
	  password: String,
	  username: String
	});

	//On Save Hook, encrypt password
	// Pre below...Before saving a model, run this function...
	userSchema.pre('save', function (next) {
	  //get access to the user model
	  var user = this;

	  //generate a salt, then run callback
	  bcrypt.genSalt(10, function (err, salt) {
	    if (err) {
	      return next(err);
	    }

	    // hash (encrypt) our password using the salt
	    bcrypt.hash(user.password, salt, null, function (err, hash) {
	      if (err) {
	        return next(err);
	      }

	      user.password = hash;
	      next();
	    });
	  });
	});

	userSchema.methods.comparePassword = function (candidatePassword, callback) {
	  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
	    if (err) {
	      return callback(err);
	    }

	    callback(null, isMatch);
	  });
	};

	// Create the model class
	var ModelClass = mongoose.model('user', userSchema);

	//Export the model
	module.exports = ModelClass;

/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = require("mongoose");

/***/ },
/* 8 */
/***/ function(module, exports) {

	module.exports = require("bcrypt-nodejs");

/***/ },
/* 9 */
/***/ function(module, exports) {

	module.exports = require("jwt-simple");

/***/ },
/* 10 */
/***/ function(module, exports) {

	'use strict';

	// Hold Application secrets and config
	module.exports = {
	  secret: 'sauce'
	};

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var passport = __webpack_require__(12);
	var User = __webpack_require__(6);
	var config = __webpack_require__(10);
	var JwtStrategy = __webpack_require__(13).Strategy;
	var ExtractJwt = __webpack_require__(13).ExtractJwt;
	var LocalStrategy = __webpack_require__(14);

	//Create local strategy
	var localOptions = { usernameField: 'email' };
	var localLogin = new LocalStrategy(localOptions, function (email, password, done) {
	  //Verify this email and password, call done with the user
	  // It it is the correct email and password
	  //otherwise, call done with false
	  User.findOne({ email: email }, function (err, user) {
	    if (err) {
	      return done(err);
	    }
	    if (!user) {
	      return done(null, false);
	    }

	    //compare passwords - is 'password' equal to usr.password?
	    user.comparePassword(password, function (err, isMatch) {
	      if (err) {
	        return done(err);
	      }
	      if (!isMatch) {
	        return done(null, false);
	      }

	      return done(null, user);
	    });
	  });
	});

	// Setup options for JWT Strategy
	var jwtOptions = {
	  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
	  secretOrKey: config.secret
	};

	//Create JWT Strategy
	var jwtLogin = new JwtStrategy(jwtOptions, function (payload, done) {
	  //See if the user ID in the payload exist in our database, if so call done
	  //with that user, otherwise, call done without user
	  User.findById(payload.sub, function (err, user) {
	    if (err) {
	      return done(err, false);
	    }

	    if (user) {
	      done(null, user);
	    } else {
	      done(null, false);
	    }
	  });
	});

	//Tell Passport to use this stategy
	passport.use(jwtLogin);
	passport.use(localLogin);

/***/ },
/* 12 */
/***/ function(module, exports) {

	module.exports = require("passport");

/***/ },
/* 13 */
/***/ function(module, exports) {

	module.exports = require("passport-jwt");

/***/ },
/* 14 */
/***/ function(module, exports) {

	module.exports = require("passport-local");

/***/ },
/* 15 */
/***/ function(module, exports) {

	module.exports = require("path");

/***/ },
/* 16 */
/***/ function(module, exports) {

	module.exports = require("compression");

/***/ },
/* 17 */
/***/ function(module, exports) {

	module.exports = require("socket.io");

/***/ }
/******/ ]);