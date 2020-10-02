var express               = require('express'),
    mongoose              = require('mongoose'),
    passport              = require('passport'),
    bodyParser            = require('body-parser'),
    LocalStrategy         = require('passport-local'),
    passportLocalMongoose = require('passport-local-mongoose'),
    User                  = require('./models/user'),
    session              = require('express-session')

mongoose.connect('mongodb://localhost/Auth_demo',
{useNewUrlParser:true, useUnifiedTopology: true});

var app = express();

app.use(session({
  secret: 'this can be anything at all. These three are all required',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//===========
// ROUTES
//===========

app.get('/', function(req, res){
  res.render('home');
});

app.get('/secret', isLoggedIn, function(req, res){
  res.render('secret');
});

//============
// AUTH ROUTES
//============

// SHOW SIGN UP FORM
app.get('/register', function(req, res){
  res.render('register');
});

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

// LOGIN ROUTES
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

// LOG OUT ROUTE
app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

function isLoggedIn(req, res, next){
  // CHECK IF isAuthenticated (COMES WITH PASSPORT),
  if(req.isAuthenticated()){
    // IF YES, RUN THE NEXT STEP
    return next();
  } // IF NOT, REDIRECT TO LOGIN AGAIN
  res.redirect('/login');
};

app.listen(3000, function(){
  console.log('The Auth_demo server has started!');
});
