import React, { Component } from 'react'
var request = require('superagent')
import _ from 'underscore'
import Playlist from './Playlist'

//var SPOTIFY_TOKEN;
window.SPOTIFY_TOKEN = null;
//var SOUNDCLOUD_TOKEN = '1-234617-3207-a064dad6aed93c5da0';
//SC.initialize({oauth_token: SOUNDCLOUD_TOKEN});

export default class App extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      playlistOffset: 0
    };
  }

  componentDidMount() {
    if(this.props.soundcloudToken){
      console.log("init sc client", this.props);
      SC.initialize({oauth_token: this.props.soundcloudToken});
    }

    if(this.props.spotifyToken){
      window.SPOTIFY_TOKEN = this.props.spotifyToken; // global state ftw!
      this.loadPlaylists();
    }
  }

  loadPlaylists(url){
    console.log("load playlists");
    url = url || "https://api.spotify.com/v1/me/playlists?limit=10&offset=" + this.state.playlistOffset;
    get(url, (data) => {
      var playlists = this.state.playlists || [];
      playlists = _.union(playlists, data.items);

      if(data.error){
        console.log("Spotify Error", data.error);
        if(data.error.status === 401){
          this.setState({

          })
        }
      }else{
        console.log("playlist", data);
        this.setState({
          playlists: playlists,
          playlistOffset: this.state.playlistOffset + 10,
          next_href: data.next
        });
      }
    });
  }

  handleMoreClick(){
    this.loadPlaylists(this.state.next_href)
  }

  render() {
    var spotifyUrl = "https://accounts.spotify.com/authorize?client_id=8bd399434dcf455eb66fdb500adb7288&";
    spotifyUrl += "redirect_uri=" + encodeURIComponent(window.location.origin) + '/';
    spotifyUrl += "&scope=user-read-private%20user-read-email%20playlist-read-private&response_type=token&state=123";

    var soundcloudUrl = "https://soundcloud.com/connect?response_type=token&scope=non-expiring&";
    if(window.location.origin === "http://spotify-soundcloud.dev") {
      soundcloudUrl += "client_id=d3a34949dd2df66660737dcc0ea79336&";
    }else{
      soundcloudUrl += "client_id=2a29b786d884f77413df3e163c63ea7e&";
    }
    soundcloudUrl += "redirect_uri=" + encodeURIComponent(window.location.origin) + '/&';


    //      <div className="logo">	&#127820; 	&#x1f34c; sdf</div>

    return <div className="home">
      <header>
        <p>Get your <b>Spotify</b> playlists on <b>SoundCloud Go</b>!</p>
        <a className={"step step-1 " + (this.state.playlists ? "step-done" : "")} href={spotifyUrl}>Connect to Spotify.</a>
        <a className={"step step-2 " + ((this.state.playlists && this.props.soundcloudToken) ? "step-done" : "")} href={soundcloudUrl}>Connect to SoundCloud.</a>
        <a className="step step-3">Pick your playlists:</a>
      </header>

      <div className="playlists">
        {_.map(this.state.playlists || [], (playlist) => {
          return <Playlist key={playlist.id} spotifyToken={this.props.spotifyToken} soundcloudToken={this.props.soundcloudToken} playlist={playlist} />
        })}
      </div>

      { this.state.next_href ? <button className="load-more" onClick={this.handleMoreClick.bind(this)}>load more...</button> : "" }
    </div>

  }
}


function get(url, cb){
  request.get(url).set('Authorization', 'Bearer ' + SPOTIFY_TOKEN ).end((err, res) => {
    var data = JSON.parse(res.text);
    cb(data);
  });
}
