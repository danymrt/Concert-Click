#!/usr/bin/env node
const fs = require('fs');


var amqp = require('amqplib/callback_api'); 
	amqp.connect('amqp://localhost', function(err, conn) {
		conn.createChannel(function(err, ch) {
		  var ex = 'direct';
			var args=['canzoni','estratto','immagini'];
		  ch.assertExchange(ex, 'direct', {durable: true});
		  ch.assertQueue('', {exclusive: true}, function(err, q) {
		    console.log(' [*] Waiting for logs. To exit press CTRL+C');
		    args.forEach(function(severity) {
        	ch.bindQueue(q.queue, ex, severity);       		
      	});	 
		    ch.consume(q.queue, function(msg) {
		      console.log(" [x] %s: '%s'", msg.fields.routingKey, msg.content.toString());
		      fs.appendFile(msg.fields.routingKey+'.txt', msg.content.toString()+'\n', function (err) {
				  	if (err) throw err;
					});
		    }, {noAck: true});
		  });
		});
	});

