import React from 'react';
import './SearchResult.css';
import { TrackList } from '../TrackList/TrackList';

export class SearchResult extends React.Component {
    render() {
        const seachResult = this.props.searchResult;
        return (
            <div className="SearchResults">
            <h2>Results</h2>
            <TrackList tracks={seachResult} onAdd={this.props.onAdd} />
            </div>
        );
    }
}