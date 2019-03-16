var express = require('express');
var request = require('request');
var bodyParser = require("body-parser");
var app = express();
var a_t = '';
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/login', function(req, res){
  res.redirect("https://accounts.google.com/o/oauth2/v2/auth?scope=https://www.googleapis.com/auth/calendar&response_type=code&include_granted_scopes=true&state=state_parameter_passthrough_value&redirect_uri=http%3A%2F%2Flocalhost:3000&client_id=client_id");
});

app.get('/', function(req, res){
  console.log("code taken");
  

  var formData = {
    code: req.query.code,
    client_id: 'clien_id',
    client_secret: 'client_secret',
    redirect_uri: 'http://localhost:3000',
    grant_type: 'authorization_code',
		
  }


  request.post({url:'https://www.googleapis.com/oauth2/v4/token', form: formData}, function optionalCallback(err, httpResponse, body) {
  if (err) {
    return console.error('upload failed:', err);
  } 
  console.log('Upload successful!  Server responded with:', body);
  var info = JSON.parse(body);
  res.send("Got the token "+ info.access_token);
  a_t = info.access_token;a_t = info.access_token;
});

});


app.get('/insert', function(req, res){
  var url= 'https://www.googleapis.com/calendar/v3/calendars/primary/events';
  
var headers= {
    'Authorization': 'Bearer '+a_t,
		'Content-Type': 'application/json'
		
    };
	var body1={
	'descrition' : 'Evento musicale',
	'summary' : 'Concerto',
	'location': 'Palalottomatica(Roma)',
	'end': {
	'dateTime' : '2019-03-09T23:00:00+01:00',
	'timeZone': 'Europe/Rome'
	},
	'start':{
	'dateTime': '2019-03-09T21:00:00+01:00',
	'timeZone' : 'Europe/Rome'
	}
  };
	
  request.post({headers: headers,
  url: url,
  body: JSON.stringify(body1)
  },function callback(error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log(body);
		console.log("evento aggiunto!")
   
    res.send(body);
    }
  else {
    console.log(error);
		res.send(body);
  }
  });
	
});
app.listen(3000);
