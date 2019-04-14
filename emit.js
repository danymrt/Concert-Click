#!/usr/bin/env node

var amqp = require('amqplib/callback_api');

function createQueue(artist,canzoni,estratto,img,t){
	amqp.connect('amqp://localhost', function(err, conn) {
		conn.createChannel(function(err, ch) {
				var ex = 'direct';			
				ch.assertExchange(ex, 'direct', {durable: true});
				for(var i=0; i<canzoni.length; i++){
					ch.publish(ex, 'canzoni', new Buffer(canzoni[i]));
					console.log(" [x] Sent %s: '%s'", 'canzoni', canzoni[i]);	
					ch.publish(ex, 'estratto', new Buffer(estratto[i]));
					console.log(" [x] Sent %s: '%s'", 'estratto', estratto[i]);
					ch.publish(ex, 'immagini', new Buffer(img[i]));
					console.log(" [x] Sent %s: '%s'", 'immagini', img[i]);		
			}
			return t=1;
		});
	});
}

module.exports.createQueue = createQueue;
