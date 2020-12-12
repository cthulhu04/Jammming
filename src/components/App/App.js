// import logo from './logo.svg';
import React from 'react';
import { SearchBar } from '../SearchBar/SearchBar';
import { SearchResult } from '../SearchResult/SearchResult';
import { Playlist } from '../Playlist/Playlist';
import './App.css';
import  Spotify  from '../../util/Spotify';
// import  TestSpotify  from '../../util/TestSpotify';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults : [],
      PlaylistName: 'My PlayList',
      PlaylistTracks: [],
    }

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.seach = this.seach.bind(this);
  }

  

  addTrack(tracks) {
    let playListTracks = this.state.PlaylistTracks;
    if(playListTracks.find(savedTrack => savedTrack.id === tracks.id )) {
      return;
    }
    playListTracks.push(tracks);    
    this.setState({ PlaylistTracks: playListTracks });
  }


  removeTrack(track) {
    let tracks = this.state.PlaylistTracks;
    tracks = tracks.filter(currentTrack => currentTrack.id !== track.id);
    this.setState({ PlaylistTracks: tracks });
  }

  updatePlaylistName(name) {
    this.setState({ PlaylistName: name });
  }


  savePlaylist() {
    const trackURIs = this.state.PlaylistTracks.map(track => track.uri);
    Spotify.savePlaylist(this.state.PlaylistName, trackURIs).then(() => {
      this.setState({
        playListnames: 'New Playlist',
        PlaylistTracks: [],
      })
    })

  }

  seach(term) {
    Spotify.search(term).then(searchResult => {
      this.setState({ searchResults: searchResult });
    }).then(() => console.log('search success'))
    .catch(erro => console.log('soemthing is wrong is this erro'))
    // TestSpotify.search(term).then(response => console.log(response.tracks.name))
  }

  render() { 
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.seach}/>
          <div className="App-playlist">
           <SearchResult searchResult={this.state.searchResults} onAdd={this.addTrack}/>
           <Playlist 
              playListnames={this.state.PlaylistName}
              playList={this.state.PlaylistTracks} 
              onRemove={this.removeTrack}
              onNameChange={this.updatePlaylistName}
              onSave={this.savePlaylist}
              />
          </div> 
        </div>
      </div>
    );
  }
}

export default App;
