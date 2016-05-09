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
    var playlistObj = {
      title: this.props.name,
      sharing: 'private',
      description: "This playlist was made with <a href='http://theplaylist.guru'>The Playlist Guru</a>. These tracks are missing: ...",
      tag_list: "spotify:id=" + this.props.id
    };
    var trackIds = this.props.trackIds.split(",")
    playlistObj.tracks = _.map(trackIds, (trackId) => {
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
    </div>
  }
}
