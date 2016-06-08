Import many:
cd ~/playlistguru


./import.rb 252000000 252100000 &
./import.rb 252100000 252200000 &
./import.rb 252200000 252300000 &
./import.rb 252300000 252400000 &
./import.rb 252400000 252500000 &
./import.rb 252500000 252600000 &
./import.rb 252600000 252700000 &
./import.rb 252700000 252800000 &
./import.rb 252800000 252900000 &
./import.rb 252900000 252999999 &

./import.rb 251000000 251100000 &
./import.rb 251100000 251200000 &
./import.rb 251200000 251300000 &
./import.rb 251300000 251400000 &
./import.rb 251400000 251500000 &
./import.rb 251500000 251600000 &
./import.rb 251600000 251700000 &
./import.rb 251700000 251800000 &
./import.rb 251800000 251900000 &
./import.rb 251900000 251999999 &


./import.rb 250000000 250100000 &
./import.rb 250100000 250200000 &
./import.rb 250200000 250300000 &
./import.rb 250300000 250400000 &
./import.rb 250400000 250500000 &
./import.rb 250500000 250600000 &
./import.rb 250600000 250700000 &
./import.rb 250700000 250800000 &
./import.rb 250800000 250900000 &
./import.rb 250900000 250999999 &


# States:



UI
  - Spotify connected
  - SoundCloud connected



Playlist
  (loaded)

  lookedup
    no-match
    partially-synced
    synced












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


ruby importer:

require 'active_support/all'

i = 263209137
while i > 262586191 do
   ids = ((i - 200)...(i)).to_a
   puts "Loading #{i - 200} ... #{i}"
   `./get_tracks.sh #{ids.join(",")} >> isrcs8`
   i -= 200
end
