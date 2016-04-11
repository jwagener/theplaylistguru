import React, { Component } from 'react';
var request = require('superagent');
import _ from 'underscore';

var SPOTIFY_TOKEN;

export default class App extends Component {
  constructor() {
    super(...arguments);
    this.state = {};
  }

  componentDidMount() {
    SPOTIFY_TOKEN = window.location.hash.split(/=|&/)[1];
    if(SPOTIFY_TOKEN){
      get("https://api.spotify.com/v1/me/playlists", (data) => {
        this.setState({playlists: data.items});
      });
    }
  }

  render() {
    var spotifyUrl = "https://accounts.spotify.com/authorize?client_id=8bd399434dcf455eb66fdb500adb7288&";
    spotifyUrl += "redirect_uri=" + encodeURIComponent(window.location.toString().split("#")[0]);
    spotifyUrl += "&scope=user-read-private%20user-read-email%20playlist-read-private&response_type=token&state=123";

    if(this.state.playlists){
      return <div className="home">
        <p><b>Spotify - SoundCloud</b> lets you take your playlists from Spotify to SoundCloud. That's it.</p>
        <a className="step step-1 step-done" href={spotifyUrl}>Connect to Spotify </a>
        <a className="step step-2">Connect to SoundCloud </a>
        <a className="step step-3">Pick your playlists.</a>
        {_.map(this.state.playlists, (playlist) => {
          return <Playlist key={playlist.id} playlist={playlist} />
        })}

      </div>
    }
    return <div className="home">
      <p><b>Spotify - SoundCloud</b> lets you take your playlists from Spotify to SoundCloud. That's it.</p>
      <a className="step step-1" href={spotifyUrl}>Connect to Spotify </a>
      <a className="step step-2">Connect to SoundCloud </a>
      <a className="step step-3">Take your playlists with you.</a>
    </div>
  }
}

class Playlist extends Component {
  constructor(){
    super(...arguments);
    this.state = {
      selected: false
    };
  }

  handleClick(e){
    this.setState({
      selected: !this.state.selected
    });
    return e.preventDefault();
    get(e.currentTarget.href, (tracks) => {
      console.log("tracks", tracks);
    });
    e.preventDefault();
  }

  render(){
    var playlist = this.props.playlist;
    return <div className="playlist-wrapper">
      <a href={playlist.tracks.href} playlist={playlist} onClick={this.handleClick.bind(this)} className={`playlist ${this.state.selected ? "playlist-selected" : ""}`}>
        <img className="playlist-image" src={playlist.images[0].url} />
        <span className="playlist-name">{playlist.name}</span>

      </a>
    </div>
  }
}

function get(url, cb){
  request.get(url).set('Authorization', 'Bearer ' + SPOTIFY_TOKEN ).end((err, res) => {
    var data = JSON.parse(res.text);
    cb(data);
  });
}
