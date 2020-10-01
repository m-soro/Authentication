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

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get('/', function(req, res){
  res.render('home');
});

app.get('/secret', function(req, res){
  res.render('secret');
});

app.listen(3000, function(){
  console.log('The Auth_demo server has started!');
});
