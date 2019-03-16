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
var fileConc = require('./concerti');

app.post("/dati", function(req,res){
    console.log("Ricevuto una richiesta POST");
    // contenuto della richiesta
    citta= req.body.citta;
    console.log(citta);
    fileConc.getConcerti();
    // password
});

  function getCitta(){
    return citta;
  }

const appKey = <appKey>;
const appSecret = <appSecret>;

let token = null;
// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session. Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing. However, since this example does not
//   have a database of user records, the complete spotify profile is serialized
//   and deserialized.
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

// Use the SpotifyStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, expires_in
//   and spotify profile), and invoke a callback with a user object.
passport.use(
  new SpotifyStrategy(
    {
      clientID: appKey,
      clientSecret: appSecret,
      callbackURL: 'http://localhost:8888/callback'
    },
    function(accessToken, refreshToken, expires_in, profile, done) {
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



// configure Express
//app.set('views', __dirname + '/views');
//app.set('view engine', 'ejs');

app.use(session({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(__dirname + '/public'));

//app.engine('html', consolidate.swig);

/*app.get('/', function(req, res) {
  res.render('index.html',{ user: req.user });
});

app.get('/account', ensureAuthenticated, function(req, res) {
  res.render('account.html', { user: req.user });
});
*/
app.get('/artists', function(req, res) {
  var options = {
          url: 'https://api.spotify.com/v1/me/following?user_follow-modify=access_token&type=artist',
          headers: { 'Authorization': 'Bearer ' + token },
          json: true
        };

        // use the access token to access the Spotify Web API
				var nameList = [];
        request.get(options, function(error, response, body) {
					for(i=0; i<body.artists.items.length; i++){
          	nameList.push(body.artists.items[i].name);
					}
					console.log(nameList);
        });
  //res.render('login.html', { user: req.user });
})

app.get('/immagine', function(req, res){
  var options = {
    url: 'https://api.spotify.com/v1/me/following?user_follow-modify=access_token&type=artist',
    headers: { 'Authorization': 'Bearer ' + token },
    json: true
  };
  var imageList = [];
  request.get(options, function(error, response, body){
    for(i=0; i<body.artists.items.length; i++){
      imageList.push(body.artists.items[i].images[0].url);
    }
    console.log(imageList);
  })
})

// GET /auth/spotify
//   Use passport.authenticate() as route middleware to authenticate the
//   request. The first step in spotify authentication will involve redirecting
//   the user to spotify.com. After authorization, spotify will redirect the user
//   back to this application at /auth/spotify/callback
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

// GET /auth/spotify/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request. If authentication fails, the user will be redirected back to the
//   login page. Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get(
  '/callback',
  passport.authenticate('spotify', { failureRedirect: '/login' }),
  function(req, res) {
    res.sendFile('/home/biar/login/cerca.html');

  }
);

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

app.listen(8888, function(){
  console.log('server attivo nella porta 8888');
});

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed. Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}
module.exports.getCitta = getCitta;
