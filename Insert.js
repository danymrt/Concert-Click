var express = require('express');
var request = require('request');
var bodyParser = require("body-parser");
var app = express();
var server = require('./app');
var ws=require('ws');
app.use(bodyParser.urlencoded({ extended: false }));

function accessoGoogle(req, res){
  res.redirect("https://accounts.google.com/o/oauth2/v2/auth?scope=https://www.googleapis.com/auth/calendar&response_type=code&include_granted_scopes=true&state=state_parameter_passthrough_value&redirect_uri=http%3A%2F%2Flocalhost:8888&client_id=client_id");

};

function controllaEvento(req, res,a_t){
    //var url='https://www.googleapis.com/calendar/v3/calendars/primary/events';
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
            console.log("evento già aggiunto!!");

            }
        else{
            aggiungiEvento(req,res,a_t);
            }

        }
    });
}

function aggiungiEvento(req,res,a_t){

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
		'timeZone': 'Europe/'+citta
		},
		'start':{
		'dateTime': completa2+'+02:00',
		'timeZone' : 'Europe/'+citta
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
    console.log(body);
		console.log("evento aggiunto!")
    }
  else {
    console.log(error);
  }
  });
}
module.exports.aggiungiEvento= aggiungiEvento;
module.exports.accessoGoogle= accessoGoogle;
module.exports.controllaEvento=controllaEvento;
