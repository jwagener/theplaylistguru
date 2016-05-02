Spotify SoundCloud

Workaround

SC.put('/playlists/215092428?oauth_token=1-234617-3207-a064dad6aed93c5da0&bla', {playlist: {tracks: [{id:256814338}]}}).then(function(tracks){console.log(tracks)});


Exampel Bob Dylan  Melancholy Moods:
From Spotify: "USSM11600524" / USSM11600524 / on SC: 256814338

 SC.get("/tracks/256814338").then(function(track){
  console.log(track);
 });

 SC.initialize({oauth_token: '1-234617-3207-a064dad6aed93c5da0'});
 SC.get('/me/tracks').then(function(tracks){console.log(tracks)});


 SC.post('/playlists', {playlist:{title: 'Track invisible', sharing: 'private', track: [{id: 256814338}]}}).then(function(playlist){
  console.log("hallo", playlist);
 });


SC.get('/playlists/214784666/tracks').then(function(tracks){console.log(tracks)});
SC.put('/playlists/214784666/tracks/46742486').then(function(tracks){console.log(tracks)});


SC.put('/playlists/214784666', {playlist: {title: "NeuerTitle"}}).then(function(tracks){console.log(tracks)});

 214784666


SC.put('/playlists/214784666?oauth_token=1-234617-3207-a064dad6aed93c5da0&bla', {playlist: {title: "Neuer Tit"}}).then(function(tracks){console.log(tracks)});
