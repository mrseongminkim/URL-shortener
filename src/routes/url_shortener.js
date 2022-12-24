const path = require('path');

const express = require('express');

const db = require('../data/database');
const base62 = require('../utils/base62');
const counter = require('../utils/counter');
const simple_cache = require('../utils/simple_cache');

const cache = new simple_cache.Cache(1000);

const router = express.Router();

router.get('/', function (req, res) {
    console.log('index.html is sent');
    const filePath = path.join(__dirname, '../views/index.html');
    res.sendFile(filePath);
});

router.post('/shorten', async function (req, res) {
    console.log('URL is received: ', req.body.url);
    let originalUrl = req.body.url;

    const doc = await db.getDb().collection('URLs').findOne({URL: originalUrl});
    let encodedId;

    if (doc) {
        console.log("Database hit");
        encodedId = base62.encode(doc._id);
    }
    else {
        console.log("Database miss");
        let count = await counter.get_count();
        const newUrl = {_id: count, URL: originalUrl};
        await db.getDb().collection('URLs').insertOne(newUrl);
        encodedId = base62.encode(count);
        cache.put(encodedId, originalUrl);
    }
    res.json({url_res: encodedId});
});

router.get('/:encodedId', async function (req, res, next) {
    console.log("Encoded id is received: ", req.params.encodedId);
    let encodedId = req.params.encodedId;
    let decodedId = base62.decode(encodedId);

    let cached = cache.get(encodedId);
    if (cached === "CACHE_MISS") {
        console.log("Cache miss");
        const doc = await db.getDb().collection('URLs').findOne({_id: decodedId});
        try {
            if (doc) {
                cached = doc.URL;
                cache.put(encodedId, cached);
            }
            else
                throw("URL is not in the database");
        }
        catch (error) {
            return next(error);
        }
    }
    else
        console.log("Cache hit");
    res.redirect("http://" + cached);
});

module.exports = router;