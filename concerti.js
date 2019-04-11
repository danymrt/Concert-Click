//inserire nome utente nella pagina cerca.html
//bottone carino
//far in modo che quando si attivi il server parta direttamente
var express = require('express');
var request = require('request');
var bodyParser = require("body-parser");
var key = 'j3fUYN8FLd3NZ95r' ;
//var cantante='elisa';
var id;
var idEvent;
var data=[];
var datatime=[];
var place=[];
var app = express();
var server = require('./app');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));


function getidCantante(req,res){
var cantante = server.getCantante();
	var options = {
		url : 'https://api.songkick.com/api/3.0/search/artists.json?apikey=' + key + '&query=' + cantante
	}
	function callback(error, response, body){
		if (!error && response.statusCode == 200) {
			var info = JSON.parse(body);
			id=info.resultsPage.results.artist[0].id;
			console.log('Cantante: '+cantante+' Id: '+ id);
		}
		else{
			console.log(response.statusCode);
		}
		getConcerti(req,res);
	}

	request(options, callback);
}

function getConcerti(req,res){
	var luogo=server.getCitta();
	var options = {
	  url : 'https://api.songkick.com/api/3.0/artists/' + id + '/calendar.json?apikey=' + key
	}
	function callback(error, response, body){
		//console.log(body);
		if (!error && response.statusCode == 200) {
			//verificare se array = 0 in caso stampare non ci sono eventi!
			var info = JSON.parse(body);
			var array=info.resultsPage.results.event;
			var c=0;
			if(array!=undefined){
					for(var i=0; i<array.length; i++){
						idEvent=array[i].id;
						var location=array[i].venue.metroArea.displayName;
						if(luogo==location){
							c++;
							data.push(array[i].start.date);
							datatime.push(array[i].start.datetime);
							place.push(array[i].venue.displayName);
						}
					}
					console.log('In '+ luogo + ' ci sono: ' + c + ' eventi!');
				}
				else{
					console.log(response.statusCode);
				}
				console.log(datatime);
				if(c==0){
					res.sendFile('/home/biar/Desktop/ProgettoRC1/notevent.html');
				}else{
					if(datatime[0]==null){
						res.render('pages/tre', {
						          data: data, luogo:place});	
					}else{
							res.render('pages/tre', {
						          data: datatime, luogo:place});
					}
				}
			}else{
					res.sendFile('/home/biar/Desktop/ProgettoRC1/notevent.html');			
			}
		}
	}
	request(options, callback);
}
module.exports.getConcerti= getConcerti;
module.exports.getidCantante= getidCantante;
