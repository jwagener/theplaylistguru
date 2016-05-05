import React, { Component } from 'react';
var request = require('superagent');
import _ from 'underscore';

export default class PlaylistRedirect extends Component {
  constructor(){
    super(...arguments);
    this.state = {    };
  }

  componentDidMount(){
    this.createSoundCloudPlaylist()
  }

  createSoundCloudPlaylist() {
    //alert("creating playlist with ids", this.state.soundcloudTrackIds.join(', '));
    var playlistObj = {
      title: this.props.name,
      sharing: 'private',
      description: "Playlist created with http://spotify-soundcloud.herokuapp.com. List of missing tracks: ..."
    };

    playlistObj.tracks = _.map(this.props.trackIds, (trackId) => {
      return {
        id: trackId
      };
    });

    SC.post('/playlists?oauth_token=' + this.props.soundcloudToken + '&bla', {playlist: playlistObj}).then((res) => {
      window.location = res.permalink_url + "/" + res.secret_token;
    });
  }

  render(){
    return <div>
      <div className="loader"></div>
      <span className="status">creating playlist...</span>
    </div>
  }
}
