
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const request = require("request");
const SpotifyStrategy = require("passport-spotify").Strategy;
const http = require('http');
const qs = require('querystring');
const WebSocket = require('ws')
var url = require('url');
var path = require('path');
var app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
var citta = null;
var cantante = null;
var fileConc = require('./concerti');
var fileEvento = require('./Insert');
var nameList = [];
//var fileApp = require('./app');
// set the view engine to ejs
app.set('view engine', 'ejs');


const appKey = 'appkey';
const appSecret = 'appkey';
var a_t='';
let token = null;

const server = http.createServer(app);
const wss = new WebSocket.Server({server});

wss.on('connection', function connection(ws){
		console.log("Connessione stabilita con le websocket!");
		ws.on('message', function incoming(message){
			if(message=="Connessione stabilita"){
				fileEvento.controllaEvento(a_t,ws);
			}
		});
});
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
  res.sendFile('/home/biar/Desktop/ProgettoRC/quattro.html');
});

server.listen(8888, function(){
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

app.post("/aggiungiConc", function(req, res){
    console.log("Ricevuto una richiesta POST");
    // contenuto della richiesta
    info= req.body.evento;
    console.log(info);
		fileEvento.accessoGoogle(req,res);
});

function getEvento(){
    return info;
  }

app.get('/start', function(req,res) {
  res.sendFile('/home/biar/Desktop/ProgettoRC/login.html');

})

app.get('/', function(req, res){
  console.log("code taken");


  var formData = {
    code: req.query.code,
    client_id: 'appkey',
    client_secret: 'appkey',
    redirect_uri: 'http://localhost:8888',
    grant_type: 'authorization_code',

  }


  request.post({url:'https://www.googleapis.com/oauth2/v4/token', form: formData}, function optionalCallback(err, httpResponse, body) {
  if (err) {
    return console.error('upload failed:', err);
  }
  console.log('Upload successful!  Server responded with:', body);
  var info = JSON.parse(body);
  a_t = info.access_token;
	//fileEvento.aggiungiEvento(req,res,a_t);
	res.sendFile('/home/biar/Desktop/ProgettoRC/quattro.html');
});
});

// app.post("/aggiungiCal", function(req, res){
//     fileEvento.aggiungiEvento(req,res,a_t);
// });



module.exports.getEvento = getEvento;
module.exports.getCitta = getCitta;
module.exports.getCantante = getCantante;
