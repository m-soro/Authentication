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

## SecretPage Part 3
  * Add Register form
   - `app.use(bodyParser.urlencoded({extended:true}));` since were getting data from the form.
  ```
      <form class="" action="/register" method="POST">
        <input type="text" name="username" placeholder="username">
        <input type="password" name="password" placeholder="password">
        <button type="submit">Submit</button>
      </form>
  ```
  * Add Register route
  ```
    // HANDLING THE USER SIGN UP

    app.post('/register', function(req, res){

      //TEST WITH - res.send('Register Post Route');
      //INSIDE THE User.register(IS new User object AND INSIDE IS JUST THE (USER'S USERNAME))

      User.register(new User({username: req.body.username}),

      //ADD THE PASSWORD AFTER CREATING THE NEW USER, WE WON'T STORE THE PASSWORD AS ENTERED IN OUR DATABASE
      //WE PASS THE PASSWORD AS 2ND ARGUMENT, User.register WILL THEN HASH THE PASSWORD
      //AND STORE IN THE DATABASE

      req.body.password, function(err, user){
        if(err) {
          console.log(err)
          // RETURN TO FORM IF THERE IS AN ERROR
          return res.render('register');
        }

        //IF NO ERROR RUN, passport.authenticate THIS WILL LOG THE USER IN
        //AND RUN THE SERIALIZED METHOD
        //AND THAT WE WANT TO USE THE 'LOCAL' STRATEGY

        passport.authenticate('local')(req, res, function(){

          //ONCE THE USER IS LOGGED IN THEN REDIRECT TO SECRET
          //OTHERWISE, RETURN TO REGISTRATION FORM.

          res.redirect('/secret');
        });
      });
    });
  ```
  *If you check our database*
  ```
      {
    	"_id" : ObjectId("5f7612a5a2bca3709a63327b"),
    	"username" : "msoro@mohg.com",
    	"salt" : "a7046af5b7d26086eb74e1662665f07890f238609f77832dfd1d2b67ff9b2f1d",
    	"hash" : "1859ec94ef1217681fcc23489ad605fc823686f3e8c03701c2d94027912f1180a2fce3eb9dd84dfa6f6e6d4b67a13c2352efed9170b7658c138cffac7f4463f0c3e9597a051aeba33e7562cf2bf86e74b18ffa4b40ce3efdd64d915bac938b9ab36335a13ca1498c4f368b9fe80261a379df53fd639bc8932669bcc18db7ec0357d236caf2c9ffdad6e41673b4d0e54187d2382dc5166791ede8c3f7bf220dd355bce23d6106a51ab5047e4bba3ffcba65f63743cbbe95dc12b795eb37e7988a962b7af084502e0764db0e520fc519745877faa6711e2fafdacaec120204cfa93c1faee0c4afd49f1c14b129fcb799597faa53e602776d1f0974d062a203f6cd116c540f303e4f20200d850ab688ad1853300d29d41abc4bdc5587d2f53fe5bc0b9c3de082549da7af0956002817ca5911959f957e06202e20f89ba2a90e20e9f8dbbe55d490d797ddbaa35871366f248d8ae761d653c332ef10ec5095054e37f5ed85996512de3725583c22fe1c74f4e9f8e23c78a05a0ff9bd6ef711b161afb11685fc97142dda4758f2da175e87b59848fbc24122d20356b136daf991dabca3cf31476b9bf0b87c9753e2de67207be264a7ed98133d5e38c68d7d5b1369f7d6f27d362f803527c59d19248cc323ff998233d9c7d7817ca3507adfb3350624fb11b6122e0a7eedf7697b93d7183a4c87fef1c226626268d4c0e855a0cac79f",
    	"__v" : 0
    }
  ```
  - our password is hashed and the salt property helps to unhash this password.

## SecretPage Part 4
  * Add Login form - you know how to do this!
  * Add Login routes
  ```
      // RENDER LOG IN FORM
      app.get('/login', function(req, res){
        res.render('login');
      });

      // LOG IN LOGIC
      // MIDDLEWARE - SITS BETWEEN THE BEGINNING AND BEFORE THE END OF THE ROUTE
      // passport.authenticate - CHECKS THE CREDENTIALS. IT AUTHENTICATES
      // WILL TAKE THE USERNAME AND PASSWORD INSIDE request.body THEN WE PROVIDE AN OBJECT
      // WITH TWO OPTIONS: SUCCESS AND FAILURE
      app.post('/login', passport.authenticate('local', {
        successRedirect: '/secret',
        failureRedirect: '/login'
      }), function(req, res){

      });
  ```
  - *don't forget to add* `passport.use(new LocalStrategy(User.authenticate()));`, we are telling passport to create a new local strategy, using the `User.authenticate()` coming from the `user.ejs` from `passportLocalMongoose`.

  *Now if we try to sign in to an account that doesn't work, it wont take us to the log in page!*
