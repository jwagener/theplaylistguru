import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

//http://spotify-soundcloud.dev/?code=fdcd74b33d28dcbaeff95550fc06ff1b&state=SoundCloud_Dialog_921b4#access_token=1-234617-3207-a064dad6aed93c5da0&scope=non-expiring
// or
//http://spotify-soundcloud.dev/#access_token=BQAtABaTY16URtfoaZcQc8FnCwjgbsRYTuxKQcHDcAkFQYx_r-zWSK8sZ_7fTqZdyFGPvmb8xWa7-mcQGEYNgc3TqP7lS5DhUIn6Yrr610zVyDyUO_yfKowYucZNDdTxz5D82W0pc2ZeAEqiA7oyKMCe_UPT2cU8yZzBYNWnuv3g&token_type=Bearer&expires_in=3600&state=123

if(window.location.hash.toString().indexOf("access_token") !== -1) {
  var parts = window.location.hash.split(/=|&/);
  var token = parts[1];

  if(window.location.hash.toString().indexOf("non-expiring") !== -1) {
    console.log("SC token:", token);
    localStorage.setItem("soundcloudToken", token);
  }else{
    console.log("Spotify token:", token);
    localStorage.setItem("spotifyToken", token);
  }
}

var soundcloudToken = localStorage.getItem("soundcloudToken");
var spotifyToken = localStorage.getItem("spotifyToken");

ReactDOM.render(<App spotifyToken={spotifyToken} soundcloudToken={soundcloudToken} />, document.getElementById('root'));
