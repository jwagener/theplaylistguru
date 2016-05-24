import React, { Component } from 'react'
var request = require('superagent')
import _ from 'underscore'
import Playlist from './Playlist'

window.SPOTIFY_TOKEN = null;
window.SOUNDCLOUD_TOKEN = null;
window.Spotify = {
  get: function (url, cb){
    request.get(url).set('Authorization', 'Bearer ' + SPOTIFY_TOKEN ).end((err, res) => {
      var data = JSON.parse(res.text);
      cb(data);
    });
  }
};

export default class App extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      playlistOffset: 0,
      playlistMap: {}
    };
  }

  componentDidMount() {
    if(this.props.soundcloudToken){
      window.SPOTIFY_TOKEN = this.props.soundcloudToken; // global state ftw!
      SC.initialize({oauth_token: this.props.soundcloudToken});
    }

    if(this.props.spotifyToken){
      window.SPOTIFY_TOKEN = this.props.spotifyToken; // global state ftw!
      this.loadPlaylists();
    }

    window.onscroll = this.handleScroll.bind(this)
  }

  handleScroll(e) {
    var scrolledToBottom = window.scrollY + window.innerHeight >= document.body.scrollHeight
    if(scrolledToBottom && this.state.next_href) {
      this.handleMoreClick()
    }
  }

  loadPlaylists(url){
    SC.get("/me/playlists", {limit: 200, representation: "compact"}).then((res) => {
      var playlistMap = {};
      _.map(res, (playlist) => {
        var match = playlist.tag_list.match(/spotify:id=([^ ]*)/)
        if(match && match[1]){
          //console.log(playlist.tag_list)
          playlistMap[match[1]] = playlist
        }
      });
      this.setState({playlistMap: playlistMap})

      ga('send', {
        hitType: 'event',
        eventCategory: 'Playlists',
        eventAction: 'load',
        eventLabel: ''
      });

      console.log("SC play list", res, playlistMap);
    });

    url = url || "https://api.spotify.com/v1/me/playlists?limit=10&offset=" + this.state.playlistOffset;
    Spotify.get(url, (data) => {
      var playlists = this.state.playlists || [];
      playlists = _.union(playlists, data.items);

      if(data.error){
        console.log("Spotify Error", data.error);
        if(data.error.status === 401){
          this.setState({

          })
        }
      }else{
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

  spotifyConnectUrl() {
    var spotifyUrl = "https://accounts.spotify.com/authorize?client_id=8bd399434dcf455eb66fdb500adb7288&";
    spotifyUrl += "redirect_uri=" + encodeURIComponent(window.location.origin) + '/';
    spotifyUrl += "&scope=user-read-private%20user-read-email%20playlist-read-private&response_type=token&state=123";
    return spotifyUrl;
  }

  soundcloudConnectUrl() {
    var soundcloudUrl = "https://soundcloud.com/connect?response_type=token&scope=non-expiring&";
    if(window.location.origin.match(/.dev/)) {
      soundcloudUrl += "client_id=d3a34949dd2df66660737dcc0ea79336&";
    }else{
      soundcloudUrl += "client_id=2a29b786d884f77413df3e163c63ea7e&";
    }
    soundcloudUrl += "redirect_uri=" + encodeURIComponent(window.location.origin) + '/&';
    return soundcloudUrl
  }

  render() {
    var step = 1
    if(this.state.playlists){
      step = 2
      if(this.props.soundcloudToken){
        step = 3
      }
    }
    var className = "home current-step-" + step


    return <div className={className}>
      <header>
        <h1>The Playlist Guru</h1>
        <p>Add your <b>Spotify</b> playlists to <b>SoundCloud Go</b> in 3 steps:</p>
        <a className={"step step-1 "} href={this.spotifyConnectUrl()}>Connect to Spotify.</a>
        <a className={"step step-2 "} href={this.soundcloudConnectUrl()}>Connect to SoundCloud.</a>
        <a className="step step-3">Pick your playlists.</a>
      </header>

      <div className="playlists">
        {_.map(this.state.playlists || [], (playlist) => {
          return <Playlist key={playlist.id} spotifyToken={this.props.spotifyToken} soundcloudToken={this.props.soundcloudToken} playlist={playlist} soundcloudPlaylist={this.state.playlistMap[playlist.id]} />
        })}
      </div>

      { this.state.next_href ? <button className="load-more" onClick={this.handleMoreClick.bind(this)}>load more playlists...</button> : "" }
    </div>

  }
}
