//inserire nome utente nella pagina cerca.html
//bottone 
//far in modo che quando si attivi il server parta direttamente
var express = require('express');
var request = require('request');
var bodyParser = require("body-parser");
var key = 'appKey' ;
var cantante='elisa';
var id;
var idEvent;
var app = express();
var server = require('./app');

app.use(bodyParser.urlencoded({ extended: false }));

getidCantante();

function getidCantante(){
	var options = {
		url : 'https://api.songkick.com/api/3.0/search/artists.json?apikey=' + key + '&query=' + cantante
	}
	function callback(error, response, body){
		if (!error && response.statusCode == 200) {
			var info = JSON.parse(body);
			id=info.resultsPage.results.artist[0].id;
			console.log('Cantante: '+cantante+' Id: '+ id);
		}
		else
			console.log(response.statusCode);
	}
	request(options, callback);
}

function getConcerti(){
	var luogo=server.getCitta();
	var options = {
	  url : 'https://api.songkick.com/api/3.0/artists/' + id + '/calendar.json?apikey=' + key
	}
	function callback(error, response, body){
		if (!error && response.statusCode == 200) {
			var info = JSON.parse(body);
			var array=info.resultsPage.results.event;
			var c=0;
			for(var i=0; i<array.length;i++){
				idEvent=array[i].id;
				var location=array[i].venue.metroArea.displayName;
				if(luogo==location){
					c++;
					var t=[idEvent,location,array[i].venue.displayName,array[i].start.date,array[i].start.datetime]
					console.log(t);
				}
			}
			console.log('In '+ luogo + ' ci sono: ' + c + ' eventi!');
		}
		else
			console.log(response.statusCode);
	}
	request(options, callback);
}
module.exports.getConcerti= getConcerti;
