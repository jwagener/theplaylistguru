import React, { Component } from 'react';
//var fetchUrl = require("fetch").fetchUrl;
//import fetchUrl from 'fetch'
//import ajax from 'ajax';
var request = require('superagent');
import _ from 'underscore';

export default class App extends Component {
  constructor() {
    super(...arguments);
    this.state = {};
  }

  get(url, cb){
    request.get(url).set('Authorization', 'Bearer ' + this.at ).end((err, res) => {
      var data = JSON.parse(res.text);
    // Calling the end function will send the request
      cb(data);
    });
  }

  componentDidMount() {
    this.at = window.location.hash.split(/=|&/)[1];
    if(this.at){

      request.get("https://api.spotify.com/v1/me/playlists").set('Authorization', 'Bearer ' + this.at ).end((err, res) => {
        var data = JSON.parse(res.text);
      // Calling the end function will send the request
        this.setState({playlists: data.items});
        console.log(data);
      });
    }
  }

  handleClick(e){
    this.get(e.currentTarget.href, (tracks) => {
      console.log("tracks", tracks);
    })
    e.preventDefault();
  }

  render() {
    var spotifyUrl = "https://accounts.spotify.com/authorize?client_id=8bd399434dcf455eb66fdb500adb7288&";
    spotifyUrl += "redirect_uri=" + encodeURIComponent("http://spotify-soundcloud.dev/callback");
    spotifyUrl += "&scope=user-read-private%20user-read-email%20playlist-read-private&response_type=token&state=123";
    if(this.state.playlists){
      return <div className="home">
        <a className="step step-2">Connect to SoundCloud </a>
        <a className="step step-3">Take your playlists with you.</a>
        {_.map(this.state.playlists, (playlist) => {
          return <a href={playlist.tracks.href} playlist={playlist} onClick={this.handleClick.bind(this)} className="playlist">
            <img className="playlist-image" src={playlist.images[0].url} />
            <span className="playlist-name">{playlist.name}</span>
          </a>
        })}
      </div>
    }
    return <div className="home">
      <a className="step step-1" href={spotifyUrl}>Connect to Spotify </a>
      <a className="step step-2">Connect to SoundCloud </a>
      <a className="step step-3">Take your playlists with you.</a>
      {this.state.playlists && this.state.playlists.join(", ")}
    </div>
  }
}
