var express = require('express');
var request = require('request');
var bodyParser = require("body-parser");
var app = express();
var server = require('./app');
var fs=require('fs');
app.use(bodyParser.urlencoded({ extended: false }));

/*funzione per reindirizzamento all'accesso a Google*/
function accessoGoogle(req, res){
  res.redirect("https://accounts.google.com/o/oauth2/v2/auth?scope=https://www.googleapis.com/auth/calendar&response_type=code&include_granted_scopes=true&state=state_parameter_passthrough_value&redirect_uri=http%3A%2F%2Flocalhost:8888&client_id=client_id");
};

/*funzione per controllare se un evento è presente in una data specifica*/
function controllaEvento(a_t,req,res){
    var lista2=new Array();
		var cantante=server.getCantante();
		var info= server.getEvento();
		var d=info.split(" ")[0];
    if(d.length>11){
			var data=d.split("T")[0];
      dateagg=data;
		}
    else{
       dateagg=d;
    }
		var options={
  		url:'https://www.googleapis.com/calendar/v3/calendars/primary/events',
  		headers: {
    	'Authorization': 'Bearer '+a_t,
    	}
		};
    request(options, function callback(error, response, body){
    	if (!error && response.statusCode == 200){
      	var info = JSON.parse(body);
      	var lista=info.items;
        if(lista!=null){
					var i;
          for(i=0; i<lista.length; i++){
          	if(lista[i].start.date!=undefined){
            	lista2.push(lista[i].start.date)
            }
            else{
            	var datetime=lista[i].start.dateTime;
              var datanormale=datetime.split('T')[0];
              lista2.push(datanormale);
            }
        	}
			  	if(lista2.includes(dateagg)){
		      	console.log("evento già aggiunto!!");
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
											res.render('pages/quattro', { t: 'Evento già aggiunto', canzone: canzoni, estratto: estratto, img: img,cantante:cantante});
										}
									});	
								}
							});
						}
					});
		      }
		      else{
		      	aggiungiEvento(a_t,req,res);
		      }
				}
        else{
          aggiungiEvento(a_t,req,res);
        }
      }
    });
}

/*aggiunge l'evento al calendario*/
function aggiungiEvento(a_t,req,res){
  var url= 'https://www.googleapis.com/calendar/v3/calendars/primary/events';
  var info= server.getEvento();
	var cantante=server.getCantante();
	var lista=info.split(" ");
	var luogo=lista[1];
	var citta=server.getCitta();
	var completa=lista[0];
	if(completa.length>11){
		var data=completa.split("T")[0];
		var completa2=completa.split("+")[0];
		var headers= {
    'Authorization': 'Bearer '+a_t,
		'Content-Type': 'application/json'
    };
		var body1={
		'descrition' : 'Evento musicale',
		'summary' : 'Concerto di '+cantante,
		'location': luogo,
		'end': {
		'dateTime' : data+'T23:59:00+02:00',
		'timeZone': 'Europe/Rome'
		},
		'start':{
		'dateTime': completa2+'+02:00',
		'timeZone' : 'Europe/Rome'
		}
		};
	}else{
		console.log(completa);
		var headers= {
				'Authorization': 'Bearer '+a_t,
				'Content-Type': 'application/json'

				};
		var body1={
		'descrition' : 'Evento musicale',
		'summary' : 'Concerto di '+cantante,
		'location': luogo,
		'end': {
		'date' : completa
		},
		'start':{
		'date': completa
		}
		};
	}

  request.post({headers: headers,
  url: url,
  body: JSON.stringify(body1)
  },function callback(error, response, body) {
  if (!error && response.statusCode == 200) {
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
									res.render('pages/quattro', { t: 'Evento aggiunto', canzone: canzoni, estratto: estratto, img: img,cantante:cantante});
								}
							});
						}
					});
				}
			});
    }
  else {
    console.log(error);
  }
  });
}
module.exports.aggiungiEvento= aggiungiEvento;
module.exports.accessoGoogle= accessoGoogle;
module.exports.controllaEvento=controllaEvento;
