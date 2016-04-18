import React, { Component } from 'react';
var request = require('superagent');
import _ from 'underscore';

var SPOTIFY_TOKEN;
//var SOUNDCLOUD_TOKEN = '1-234617-3207-a064dad6aed93c5da0';
//SC.initialize({oauth_token: SOUNDCLOUD_TOKEN});

export default class App extends Component {
  constructor() {
    super(...arguments);
    this.state = {};
  }

  componentDidMount() {
    if(this.props.soundcloudToken){
      console.log("init sc client", this.props);
      SC.initialize({oauth_token: this.props.soundcloudToken});
    }

    if(this.props.spotifyToken){
      SPOTIFY_TOKEN = this.props.spotifyToken; // global state ftw!
      get("https://api.spotify.com/v1/me/playlists", (data) => {
        this.setState({playlists: data.items});
      });
    }
  }

  render() {
    var spotifyUrl = "https://accounts.spotify.com/authorize?client_id=8bd399434dcf455eb66fdb500adb7288&";
    spotifyUrl += "redirect_uri=" + encodeURIComponent(window.location.toString().split("#")[0]);
    spotifyUrl += "&scope=user-read-private%20user-read-email%20playlist-read-private&response_type=token&state=123";

    return <div className="home">
      <p>Get your <b>Spotify</b> playlists on <b>SoundCloud Go</b>!</p>
      <a className={"step step-1 " + (this.state.playlists ? "step-done" : "")} href={spotifyUrl}>Connect to Spotify.</a>
      <a className={"step step-2 " + (this.props.soundcloudToken ? "step-done" : "")} href="javascript:SC.connect()">Connect to SoundCloud.</a>
      <a className="step step-3">Pick your playlists:</a>
      {_.map(this.state.playlists || [], (playlist) => {
        return <Playlist key={playlist.id} spotifyToken={this.props.spotifyToken} soundcloudToken={this.props.soundcloudToken} playlist={playlist} />
      })}

    </div>

  }
}

class Playlist extends Component {
  constructor(){
    super(...arguments);
    this.state = {
      selected: false,
      spotifyTrackCount: null,
      soundcloudTrackCount: null,
      soundcloudTrackIds: []
    };
  }

  componentDidMount(){
    var playlist = this.props.playlist;
    this.lookupTracks(playlist.tracks.href);
  }

  lookupTracks(spotifyTracksUrl){
    var soundcloudTrackIds = this.state.soundcloudTrackIds;
    get(spotifyTracksUrl, (res) => {
    //  console.log("res", res);
      var lookupUrl = '/lookup?';
      this.setState({spotifyTrackCount: res.items.length});
      var isrc = _.map(res.items, (item) => {

        lookupUrl += 'isrc[]=' + item.track.external_ids.isrc + '&';
        return item.track.external_ids.isrc;
      });
      //console.log(isrc);

      get(lookupUrl, (res2) => {
        _.map(res2, (v,k) => {
          if(v){
            soundcloudTrackIds.push(v);
          }
        });

        this.setState({
          soundcloudTrackCount: soundcloudTrackIds.length,
          soundcloudTrackIds: soundcloudTrackIds
        });

      });
    });
  }

  createSoundCloudPlaylist() {
    //alert("creating playlist with ids", this.state.soundcloudTrackIds.join(', '));
    var playlistObj = {
      title: this.props.playlist.name,
      sharing: 'private',
      description: "A playlist imported with http://spotify-soundCloud.herokuapp.com. Missing tracks..."
    };

    playlistObj.tracks = _.map(this.state.soundcloudTrackIds, (trackId) => {
      return {
        id: trackId
      };
    });

    SC.post('/playlists?oauth_token=' + this.props.soundcloudToken + '&bla', {playlist: playlistObj}).then((res) => {
      console.log("SC Playlist", res);
      //alert('created playlist')
      this.setState({soundcloudPlaylist: res});
      window.open(res.permalink_url);
    });

  }

  handleClick(e){
    if(this.state.soundcloudPlaylist){ return }
    this.setState({
      selected: !this.state.selected
    });
    if(this.state.soundcloudTrackCount){
      this.createSoundCloudPlaylist();
    }else{
      alert("Looks like SoundCloud does not have any of these tracks yet.")
    }
    e.preventDefault();
  }

  render(){
    var playlist = this.props.playlist;
    var className= `playlist cf ${this.state.selected ? "playlist-selected" : ""}`;
    var href = playlist.tracks.href;
    if(this.state.soundcloudPlaylist){
      href = this.state.soundcloudPlaylist.permalink_url;
      className += " playlist-imported"
    }


    return <div className="playlist-wrapper">
      <a href={href} target="_blank" playlist={playlist} onClick={this.handleClick.bind(this)} className={className}>
        <span className='playlist-ratio'>
          <span className="playlist-soundcloud-track-count">{this.state.soundcloudTrackCount || "?"}</span>
          &nbsp;/&nbsp;
          <span className="playlist-spotify-track-count">{this.state.spotifyTrackCount}</span>
        </span>
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
