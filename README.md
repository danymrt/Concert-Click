# Progetto RC
Progetto per il corso 2018/19 di Reti di Calcolatori tenuto dal prof. Andrea Vitaletti presso La Sapienza Università di Roma.

## Requisiti
* Il servizio REST deve offrire delle API documentate
* Si deve interfacciare con almeno due servizi REST “esterni”
  * Almeno uno dei servizi REST esterni deve essere “commerciale” (es: twitter, google, facebook etc)
  * Almeno uno dei servizi REST esterni deve richiedere oauth
* Si devono usare Websocket e/o AMQP (o simili es MQTT)
* Il progetto deve essere su GIT (GITHUB, GITLAB ...) e documentato con un README

## Tecnologie utilizzate
* REST 1: Google (OAuth)
* REST 2: SongKick 
* REST 3: Spotify (OAuth)
* AMQP: RabbitMQ (HTML5)

## Breve descrizione
Concert Click è un’applicazione web che reinderizza l’utente, una volta eseguito il login su [Spotify](https://developer.spotify.com/documentation/web-api/), ad una pagina contenente gli artisti da lui seguiti. 
Da qui si potrà selezionare un artista e la città di cui si vogliono conoscere i concerti. 
Grazie alle API fornite da [SongKick](https://www.songkick.com/developer/) verranno restituite le date ed i luoghi dei rispettivi eventi. In caso non siano presenti eventi per quell'artista si potrà decidere di tornare indietro e scegliere un altro cantante oppure ascoltare ugualmente gli estratti delle sue canzoni principali. 
Una volta eseguito l'accesso con [Google](https://developers.google.com/calendar/) si potrà scegliere se aggiungere o meno l'evento al calendario. Infine, oltre alla riuscita dell'aggiunta dell'evento, si potranno visualizzare gli estratti delle canzoni più popolari per quell'artista.

## Setup iniziale 
Per il funzionamento su linux di AMQP occorre installare [RabbitMQ](https://www.rabbitmq.com/install-debian.html).
Il Server è basato su [Node.js](https://nodejs.org/it/) e sono richiesti i seguenti node modules:
```
$ npm install express
$ npm install body-parser
$ npm install request
$ npm install amqp
$ npm install amqplib
```

Le funzioni ausiliarie sono definite nei seguenti file : [app.js](https://github.com/daniela1195/ProgettoRC/blob/master/app.js), [insert.js](https://github.com/daniela1195/ProgettoRC/blob/master/Insert.js), [concerti.js](https://github.com/daniela1195/ProgettoRC/blob/master/concerti.js).
La documentazione della API Rest implementate è nel file [API_Rest.md]().

## Avvio
Il server è in ascolto sulla porta 8888. Digitando nel browswer http://localhost:8888/start si verrà reinderizzati alla pagina inziale di login.
