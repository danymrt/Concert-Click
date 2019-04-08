const express = require("express");
const session = require("express-session");
const passport = require("passport");
const request = require("request");
const SpotifyStrategy = require("passport-spotify").Strategy;
const http = require('http');
const qs = require('querystring');
var url = require('url');
var path = require('path');
var app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
var citta = null;
var cantante = null;
var fileConc = require('./concerti');
var nameList = [];
//var fileApp = require('./app');
// set the view engine to ejs
app.set('view engine', 'ejs');


const appKey = 'appkey';
const appSecret = 'appkey';

let token = null;


// set the view engine to ejs
app.set('view engine', 'ejs');

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});


passport.use(
  new SpotifyStrategy(
    {
      clientID: appKey,
      clientSecret: appSecret,
      callbackURL: 'http://localhost:8888/callback'
    },
    function(accessToken, _refreshToken,_expires_in, profile, done) {
      token= accessToken;
      // asynchronous verification, for effect...
      process.nextTick(function() {
        // To keep the example simple, the user's spotify profile is returned to
        // represent the logged-in user. In a typical application, you would want
        // to associate the spotify account with a user record in your database,
        // and return that user instead.
        return done(null, profile);
      });
    }
  )
);



app.use(session({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(__dirname + '/public'));

app.get(
  '/auth/spotify',
  passport.authenticate('spotify', {
    scope: ['user-read-email', 'user-read-private', 'user-follow-read'],
    showDialog: true
  }),
  function(req, res) {
    // The request will be redirected to spotify for authentication, so this
    // function will not be called.

  }

);


app.get(
   '/callback',

   passport.authenticate('spotify', { failureRedirect: '/login' }),


   function(req, res) {
     res.redirect('/artists');

   }
 );

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

app.listen(8888, function(){
  console.log('server attivo nella porta 8888');
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}
// use res.render to load up an ejs view file

app.get('/artists', function(req,res){
  var options = {
          url: 'https://api.spotify.com/v1/me/following?user_follow-modify=access_token&type=artist',
          headers: { 'Authorization': 'Bearer ' + token },
          json: true
        };

        // use the access token to access the Spotify Web API
        request.get(options, function(_error,_response, body) {
					for(i=0; i<body.artists.items.length; i++){
          	nameList.push(body.artists.items[i].name);
					}
					console.log(nameList);
          res.render('pages/cerca', {
                nameList: nameList});
        });


})

app.post("/dati", function(req, res){
    console.log("Ricevuto una richiesta POST");
    // contenuto della richiesta
    citta= req.body.citta;
    cantante= req.body.cantante;
    console.log(cantante);
    console.log(citta);
   	fileConc.getidCantante(req,res);
});
  function getCantante(){
    return cantante;
  }
  function getCitta(){
    return citta;
  }


app.get('/start', function(req,res) {
  res.sendFile('/home/biar/Desktop/ProgettoRC/login.html');

})


module.exports.getCitta = getCitta;
module.exports.getCantante = getCantante;
