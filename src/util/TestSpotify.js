const client_id = '93553a571a614454ad5e1e253e89f111';
const redirectUri = 'http://localhost:3000'; 
let accesTokken;
let expiresIn;

const TestSpotify = {
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
            window.history.pushState('Access tokken',  null, '/');
        } else {
            const accessURL = `https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`
            window.location = accessURL;
        }
    },

    search(term) {
        const accesToken = TestSpotify.getAccessToken();
        return  fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, 
        {headers: 
            {
            Authorization: `Bearer ${accesToken}`
        }
        }).then(Response => {
            return Response.json();
        }).then(jsonRespone => {
           return jsonRespone;
        });
    },

    savePlaylist(name, trackURIs) {
        if(!name && !trackURIs.length) {
            return;
        }
        const accessToken = TestSpotify.getAccessToken;
        const headers = { Authorization: `bearer ${accessToken}`};
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

export default TestSpotify;

// .then(jsonResponse => {
//     if(!jsonResponse.tracks) {
//         return [];
//     } 
//     return jsonResponse.tracks.map(track => ({
//         id: track.id,
//         name: track.name,
//         artist: track.artists[0].name,
//         album: track.album.name,
//         uri: track.uri
//     }))
// })