# Authentication

## Intro to Auth
  * What tools are we using?
    * Passport
    * Passport Local
      - is for user name and password
    * Passport Local Mongoose
      - authentication by passport for mongoose faster and simpler
  * Walk through auth flow
  * Discuss sessions
    * Express-Sessions

## SecretPage Part 1
  * Set up folder structure
  * Install needed packages
    - express, mongoose, passport, body-parser, passport-local-mongoose, passport-local, express-session, ejs
  * Add root route and template
  * Add secret route and template

    ```
        var express = require('express'),
            mongoose = require('mongoose')

        var app = express();
        mongoose.connect('mongodb://localhost/Auth_demo',
        {useNewUrlParser:true, useUnifiedTopology: true});
        app.use(bodyParser.urlencoded({extended:true}));
        app.set('view engine', 'ejs');

        app.get('/', function(req, res){
          res.render('home');
        });

        app.get('/secret', function(req, res){
          res.render('secret');
        });

        app.listen(3000, function(){
          console.log('The Auth_demo server has started!');
        });
    ```

## SecretPage Part 2
  * Create user model - you know how to do that!
  * Configure passport
    `  var passportLocalMongoose = require('passport-local-mongoose');` and `UserSchema.plugin(passportLocalMongoose);` will add a bunch of methods to our userSchema

  ```
      var mongoose = require('mongoose');
      var passportLocalMongoose = require('passport-local-mongoose');

      // schema set up
      var userSchema = new mongoose.Schema({
        username: String,
        password: String
      });

      userSchema.plugin(passportLocalMongoose);

      module.exports = mongoose.model('User', userSchema);
  ```

  *Let's connect all the packages that we installed!*
  - We need this two lines anytime we use `passport`.
  ```
    app.use(passport.initialize());
    app.use(passport.session());
  ```
  - next we'll require express-session
  ```
    var session = require('express-session')
    app.use(session({
      secret: 'this can be anything at all. These three are all required',
      resave: false,
      saveUnintialized: false
    }));
  ```

  - These lines reads the session, taking the date from the session and are responsible for encoding and decoding.

  ```
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());
  ```
