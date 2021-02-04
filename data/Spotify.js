const axios = require('axios');
const querystring = require('querystring');

const refresh_token = 'AQD-T75Vbs_CwLtzrS6VAG-ZnUt6tBg8f03d-gtqqbxdcGCF5eCIEcEWqF_9Okv9BeUUUbJtv7qyp8sVRrE1waaNCBdeTvfDHEZ29xlcIVxX5y8eyajOIUiuGROSKFt-08M';
const client_id = '60fd3507256c4d6b9b42021da6c113eb'; // Your client id
const client_secret = '5077a868a1a14d9392ca7b92d7d30257'; // Your secret

async function refresh (refreshToken, clientID, clientSecret) { 
    const auth = 'Basic ' +  new Buffer.from(clientID + ':' + clientSecret).toString('base64')
    
    const data = {
        'grant_type': 'refresh_token', 
        'refresh_token': refreshToken
    };
    return await axios.post('https://accounts.spotify.com/api/token', querystring.stringify(data), {
        headers: {
            'Authorization': auth,
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
  
}


async function getArtistId(id) {
    
    
    const res = await refresh(refresh_token, client_id, client_secret);
    console.log(res)
    let bearerToken = res.data.access_token ? res.data.access_token : '';
    

    let data = await axios
    .get(`https://api.spotify.com/v1/search?q=${id}&type=artist`, { headers: {
        'Authorization' : `Bearer ${bearerToken}`,
        'Content-Type': 'application/json'
        }})
    console.log(bearerToken)
    const arrRes = data.data.artists.items
    
    const artist = {
        artistId: 0,
        maxFollowers: 0
    }
    if (arrRes.length > 0) {
        for(obj of arrRes){
        
            if(obj.followers.total > artist.maxFollowers){
                artist.maxFollowers = obj.followers.total;
                artist.artistId = obj.id;
            }
            
        }
    }
    
    return artist.artistId
}

async function getArtistDiscografy(id) {

    const res = await refresh(refresh_token, client_id, client_secret);
    let bearerToken = res.data.access_token ? res.data.access_token : '';
    
    let data = await axios
    .get(`https://api.spotify.com/v1/artists/${id}/albums`, { headers: {
        'Authorization' : `Bearer ${bearerToken}`,
        'Content-Type': 'application/json'
        }})
    
    // console.log(data.data.items)
    const resultados = [];
    if(data.data.items.length > 0){
        data.data.items.forEach(v => {
            let album = {
                name: v.name,
                released: v.release_date,
                tracks: v.total_tracks,
                cover: v.images[0]
                };
                
            resultados.push(album)
        })
        
    }
    
    return resultados

}

module.exports = {getArtistId,getArtistDiscografy}