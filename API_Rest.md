# API REST

## Spotify
* Richesta HTTP GET https://api.spotify.com/v1/me/following

  Ottengo i cantanti seguiti dall'utente e le relative informazioni (id, immagini).
  
  Parametri: 
     * user-follow-modify: access_token (required)
     * type: artists (required)
 
* Richesta HTTP GET https://api.spotify.com/v1/artists/{id}/top-tracks
  
  Ottengo le top tracks dell'artista e le relative informazioni (estratto, immagini).
  
  Parametri: 
     * country: from_token (required)
     * id: id dell'artista 

Documentazione ufficiale [qui](https://developer.spotify.com/documentation/web-api/).
    
## Songkick
* Richiesta HTTP GET https://api.songkick.com/api/3.0/search/artists.json?apikey={your_api_key}&query={artist_name}
  
  Ottengo l'id di uno specifico artista.
  
  Parametri:
     * api_key: API key (required)
     * query: nome dell'artista (required)
     
* Richiesta HTTP GET https://api.songkick.com/api/3.0/artists/{artist_id}/calendar.json?apikey={your_api_key}
  
  Ottengo gli eventi di un particolare artista.
  
  Parametri:
     * api_key: API key (required)
     * artist_id: id dell'artista (required)

Documentazione ufficiale [qui](https://www.songkick.com/developer/).
     
## Google Calendar
* Richiesta HTTP GET https://www.googleapis.com/calendar/v3/calendars/calendarId/events
  
  Ottengo la lista degli eventi contenuti nel calendario dell'utente.
  
  Parametri:
     * calendarId: primary (required)
     
* Richiesta HTTP POST https://www.googleapis.com/calendar/v3/calendars/calendarId/events
  
  Creo un evento nel calendario dell'utente.
  
  Parametri:
     * calendarId: primary (required)

Documentazione ufficiale [qui](https://developers.google.com/calendar/).
