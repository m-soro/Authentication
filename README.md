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
  * Create user model
  * Configure passport
  
