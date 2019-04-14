const express = require("express");
const session = require("express-session");
const passport = require("passport");
const request = require("request");
const SpotifyStrategy = require("passport-spotify").Strategy;
var fs = require('fs');
var app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
var citta = null;
var cantante = '';
var id_cantante = null;
var fileConc = require('./concerti');
var fileEmq = require('./emit');
var fileEvento = require('./Insert');

app.set('view engine', 'ejs');

/*Inizializzazione dei file .txt*/

fs.writeFile('canzoni.txt', '', (errore) => { 
  if ( errore ) {
    throw errore;
  }
});
fs.writeFile('estratto.txt', '', (errore) => {
  if ( errore ) {
    throw errore;
  }
});
fs.writeFile('immagini.txt', '', (errore) => {
  if ( errore ) {
    throw errore;
  }
});

/*chiavi per API Spotify*/

const appKey = 'appKey';
const appSecret = 'appSecret';
var a_t='';
let token = null;

/*impostazione della sessione di passport*/
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

/*SpotifyStrategy richiede una funzione 'verify', che accetti le credenziali 
e invochi una callback con un oggetto utente.*/
passport.use(
  new SpotifyStrategy(
    {
      clientID: appKey,
      clientSecret: appSecret,
      callbackURL: 'http://localhost:8888/callback'
    },
    function(accessToken, _refreshToken,_expires_in, profile, done) {
      token= accessToken;
      process.nextTick(function() {
        return done(null, profile);
      });
    }
  )
);

/* Inizializzazione Passport!*/
app.use(passport.initialize());


app.get(
  '/auth/spotify',
  passport.authenticate('spotify', {
    scope: ['user-read-email', 'user-read-private', 'user-follow-read'],
    showDialog: true
  }),
  function(req, res) {
    // La richiesta verrà reindirizzata a Spotify per l'autenticazione,
    // quindi questa funzione non verrà mai richiamata.

  }

);


app.get(
   '/callback',
   passport.authenticate('spotify', { failureRedirect: '/login' }),
   function(req, res) {
     res.redirect('/artists');
   }
 );

/*attivazione del server*/

app.listen(8888, function(){
  console.log('server attivo nella porta 8888');
});

app.get('/artists', function(req,res){
	var imageList = [];
	var nameList = [];
	var idList= [];
  var options = {
          url: 'https://api.spotify.com/v1/me/following?user_follow-modify=access_token&type=artist',
          headers: { 'Authorization': 'Bearer ' + token },
          json: true
        };
        // uso l'access token per accedere a Spotify Web API
        request.get(options, function(_error,_response, body) {
					for(i=0; i<body.artists.items.length; i++){
						idList.push(body.artists.items[i].id);
          	nameList.push(body.artists.items[i].name);
						imageList.push(body.artists.items[i].images[0].url);
					}
					console.log(nameList);
					res.render('pages/cerca', {
                nameList: nameList, imageList: imageList, idList: idList});
        });


})

		
/*funzione che mi permette di ottenere le top track dell'artista passato*/
function getTracks(id, artista,t){
	var canzoni = [];
	var estratto = [];
	var img = [];
	var options = {
				url: 'https://api.spotify.com/v1/artists/'+id+'/top-tracks?country=from_token',
				headers: { 'Authorization': 'Bearer ' + token },
        json: true
        };
				
				request.get(options, function(error, response, body){
					console.log(body.tracks);
					console.log(body.tracks.length);
					for(var i=0; i<body.tracks.length; i++){
						canzoni.push(body.tracks[i].name);
						if(body.tracks[i].preview_url!=null){
							estratto.push(body.tracks[i].preview_url);
						}else{
							estratto.push('null');
						}
						if(body.tracks[i].album.images[0].url!=null){
							img.push(body.tracks[i].album.images[0].url );
						}else{
							img.push('null');
						}							
					}
					/*richiamo la funzione createQueue per inviare i dati a Rabbitmq*/
					t=fileEmq.createQueue(artista,canzoni,estratto,img,t);
					return t;
				});
}
					
		

app.post("/dati", function(req, res){
		cantante='';
    citta= req.body.citta;
   	var cantanteId= req.body.cantante.split(" "); 
		if(cantanteId.length>2){
			for(var i=0; i<cantanteId.length-1;i++) cantante+=cantanteId[i]+' ';
			id_cantante=cantanteId[cantanteId.length-1];
		}else{
			cantante=cantanteId[0];
			id_cantante=cantanteId[1];
		}
    console.log(cantante+ " "+id_cantante);
    console.log(citta);
		var t=0;
		t=getTracks(id_cantante,cantante,req,res,t);
		if(t!=0){
			c=0;
			c=fs.unlink('canzoni.txt',function(err1){
					if(err1){
						console.log(err1);
					}else{
						fs.unlink('estratto.txt',function(err2){
							if(err2){
								console.log(err2);
							}else{
								fs.unlink('immagini.txt',function(err3){
								if(err3) console.log(err3);
								return c=1;
							});
						}
					});
				}
			});
			if(c!=0){
				fileConc.getidCantante(req, res, cantante);
				}
			}
});

function getCantante(){
  return cantante;
}

function getCitta(){
	return citta;
}


app.post("/aggiungiConcerto", function(req, res){
    info= req.body.evento;
		fileEvento.accessoGoogle(req,res);
});



function getEvento(){
  return info;
}

app.get('/start', function(req,res) {
  res.render('pages/login');

})

app.get('/', function(req, res){
  console.log("code taken");
  var formData = {
    code: req.query.code,
    client_id: 'client_id',
    client_secret: 'client_secret',
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
		var cant=getCantante();
		res.render('pages/quattro',{
			t: '',cantante:cant});
	});
});

app.post("/aggiungiCalendario", function(req, res){
     fileEvento.controllaEvento(a_t,req,res);
});



module.exports.getEvento = getEvento;
module.exports.getCitta = getCitta;
module.exports.getCantante = getCantante;
