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
