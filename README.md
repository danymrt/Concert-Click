# Progetto RC
Progetto per il corso di Reti di Calcolatori 2018/19 tenuto dal prof. Andrea Vitaletti presso La Sapienza Università di Roma.

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
Concert Click è un’applicazione web che reindirizza l’utente, una volta eseguito il login su [Spotify](https://developer.spotify.com/documentation/web-api/), ad una pagina contenente gli artisti da lui seguiti. 

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
$ npm install ejs
```

Le funzioni ausiliarie sono definite nei seguenti file : [app.js](https://github.com/daniela1195/ProgettoRC/blob/master/app.js), [insert.js](https://github.com/daniela1195/ProgettoRC/blob/master/Insert.js), [concerti.js](https://github.com/daniela1195/ProgettoRC/blob/master/concerti.js).
La documentazione della API Rest implementate è nel file [API_Rest.md]().

## Funzionamento
Dopo l'avvio di app.js, il server è in ascolto sulla porta 8888. 

Digitando nel browser http://localhost:8888/start si verrà reindirizzati alla pagina inziale login.ejs. Una volta premuto il bottone, partirà il processo di autenticazione su Spotify tramite il protocollo OAuth. Grazie agli scopes inseriti nella richiesta OAuth saremo in grado di ottenere la lista di artisti seguiti dall'utente, l'indirizzo email e le informazioni sull'abbonamento. Ottenuti questi, si aprirà la pagina cerca.ejs dove verranno mostrate le immagini dei rispettivi artisti e un elenco delle possibili città da dover selezionare. 

Una volta ottenute queste informazioni, lato server si calcolerà la top track del rispettivo artista che verrà memorizzata in un file .txt tramite l'utilizzo di RabbitMQ.
Inoltre attraverso le API fornite da SongKick potremmo ricavare dettagli sui rispettvi eventi.

A questo punto, lato client, se per il cantante non sono disponibili dei concerti verrà fatto un redirect su quattro.ejs, al suo interno si potrà tornare alla pagina precedente per scegliere un nuovo artista (attraverso un apposito bottone), oppure  ascoltare gli estratti delle top tracks del cantante. 

Altrimenti, nel caso in cui ci siano concerti, verrà fatto un redirect su tre.ejs. Qui verranno mostrate le date e i luoghi da selezionare tramite checkbox. Una volta premuto il bottone partirà il processo di autenticazione su Google Calendar tramite il protocollo OAuth, grazie a cui saremo in grado di leggere e modificare il calendario dell'utente.
Successivamente verrà data la possibilità di scegliere un altro artista (tramite un redirect a cerca.ejs) oppure di confermare l'aggiunta dell'evento al calendario.

Nel caso in cui l'utente non avrà impegni per quella data si avrà una modifica del calendario altrimenti sarà notificata la non riuscita dell'operazione sul browser e mostrati in entrambi i casi gli estratti della top tracks dell'artista.

### Autori
Daniela Moretti

Francesca Peduzzi

Francesca Pellecchia
