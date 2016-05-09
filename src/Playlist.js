import React, { Component } from 'react';
var request = require('superagent');
import _ from 'underscore';

export default class Playlist extends Component {
  constructor(){
    super(...arguments);
    this.state = {
      selected: false,
      spotifyTrackCount: null,
      soundcloudTrackCount: "",
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
      var lookupUrl = '/lookup?';
      this.setState({spotifyTrackCount: res.items.length});
      var isrc = _.map(res.items, (item) => {
        lookupUrl += 'isrc[]=' + item.track.external_ids.isrc + '&';
        return item.track.external_ids.isrc;
      });

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

  render(){
    var playlist = this.props.playlist;
    var className= `playlist cf ${this.state.selected ? "playlist-selected" : ""}`;
    var href = playlist.tracks.href;
    if(this.props.soundcloudPlaylist){
      href = this.props.soundcloudPlaylist.permalink_url + "/" + this.props.soundcloudPlaylist.secret_token;
      className += " playlist-imported"
    }else{
      href = "/playlist?id=" + this.props.playlist.id + "&name=" + encodeURIComponent(this.props.playlist.name) + "&trackIds=" + this.state.soundcloudTrackIds.join(",")
    }

    return <div className="playlist-wrapper">
      <a href={href} target="_blank" playlist={playlist} className={className}>
        <img className="playlist-image" src={playlist.images.length > 0 ? playlist.images[0].url : ""} />
        <span className="playlist-name">{playlist.name}</span>
        <span className="playlist-info">
          <b>{this.state.spotifyTrackCount} tracks.</b> {this.state.soundcloudTrackCount} are on SoundCloud.
        </span>

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
