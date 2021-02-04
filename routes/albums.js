var express = require('express');
var router = express.Router();
const dataSpotify = require('../data/Spotify');

router.get('/:band', async function(req, res) {
    
    try{
        const id = await dataSpotify.getArtistId(req.params.band)
        res.json(await dataSpotify.getArtistDiscografy(id))

    }catch(e){
        res.status(401).send(e.message)
    }

});

module.exports = router;

