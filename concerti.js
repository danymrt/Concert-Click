var express = require('express');
var request = require('request');
var bodyParser = require("body-parser");
var key = 'key' ;
var fs=require('fs');
var id;
var idEvent;
var data=[];
var datatime=[];
var place=[];
var app = express();
var server = require('./app');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));

/*funzione che ottiene l'id del cantante dal sito SongKick*/
function getidCantante(req,res, cantante){
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
		getConcerti(req,res,cantante);
	}
	request(options, callback);
}

/*funzione che ottiene i concerti disponibili per il cantante selezionato*/
function getConcerti(req,res,cantante){
	var luogo=server.getCitta();
	var options = {
	  url : 'https://api.songkick.com/api/3.0/artists/' + id + '/calendar.json?apikey=' + key
	}
	function callback(error, response, body){
		var data=[];
    var datatime=[];
    var place=[];
		if (!error && response.statusCode == 200) {			
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
			}
			console.log('In '+ luogo + ' ci sono: ' + c + ' eventi!');
		}
		else{
			console.log(response.statusCode);
		}
    if(c==0){
			fs.readFile('/home/biar/Desktop/ProgettoRC/canzoni.txt','utf8',function(err1,canzoni){
					if(err1){
						console.log(err1);
					}else{
						fs.readFile('/home/biar/Desktop/ProgettoRC/estratto.txt','utf8',function(err2,estratto){
							if(err2){
								console.log(err2);
							}else{
								fs.readFile('/home/biar/Desktop/ProgettoRC/immagini.txt','utf8',function(err3,img){
								if(err3){
									console.log(err3);
								}else{
									console.log(estratto);
									res.render('pages/quattro',{
										t:'Non ci sono eventi',canzone: canzoni, estratto: estratto, img: img,cantante:cantante});
									}
								});
							}
						});
					}			
			});
    }else{
			if(datatime[0]==null){
				res.render('pages/tre', {
		              data: data, luogo:place, cantante: cantante});
			}else{
					res.render('pages/tre', {
		              data: datatime, luogo:place, cantante: cantante});
			}
		}
  }
	request(options, callback);
}
module.exports.getConcerti= getConcerti;
module.exports.getidCantante= getidCantante;
