const client_id = '93553a571a614454ad5e1e253e89f111';
const redirectUri = 'http://jammmin-tut.surge.sh'; 
let accesTokken;
let expiresIn;

const Spotify = {
    getAccessToken() {
        if(accesTokken) {
            return accesTokken;
        }
    
        // get acces token
        const accesTokenmatch = window.location.href.match(/access_token=([^&]*)/);
        const expireinMatch = window.location.href.match(/expires_in=([^&]*)/);

        if(accesTokenmatch && expireinMatch) {
            accesTokken = accesTokenmatch[1];
            expiresIn =  expireinMatch[1];

            
            window.setTimeout (() => accesTokken = '', expiresIn * 1000);
            window.history.pushState('Access token',  null, '/');
        } else {
            const accessURL = `https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`
            window.location = accessURL;
        }
    },

    search(term) {
        const accesToken = Spotify.getAccessToken();
        const searchUrl = `https://api.spotify.com/v1/search?type=track&q=${term.replace(' ', '%20')}`
        return fetch(searchUrl, 
        {headers: 
            {
            Authorization: `Bearer ${accesToken}`
        }
        }).then(Response => {
            return Response.json();
        }).then(jsonResponse => {
            if(!jsonResponse.tracks) {
                return [];
            } 
            return jsonResponse.tracks.items.map(track => ({
                id: track.id,
                name: track.name,
                artist: track.artists[0].name,
                album: track.album.name,
                uri: track.uri
            }))
        })
    },

    savePlaylist(name, trackURIs) {
        if(!name && !trackURIs.length === 0) {
            return;
        }
        const accessToken = Spotify.getAccessToken;
        const headers = { Authorization: `Bearer ${accessToken}`};
        let userId;
        return fetch('https://api.spotify.com/v1/me', {headers: headers})
        .then(response => response.json())
        .then(jsonResponse => {
            userId = jsonResponse.id
            return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
                headers: headers,
                method: 'POST',
                body: JSON.stringify({ name: name})
            }).then(response => response.json()
            ).then(jsonResponse => {
                const playListId = jsonResponse.id;
                return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playListId}/tracks`,
                {
                    headers: headers,
                    method: 'POST',
                    body: JSON.stringify({ uri: trackURIs})
                }
                )
            })
        });
    }
}

export default Spotify;