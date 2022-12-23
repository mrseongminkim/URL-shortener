const path = require('path');

const express = require('express');
const mongodb = require('mongodb');

const db = require('../data/database');
const base62 = require('../utils/base62');
const counter = require('../utils/counter');

const router = express.Router();

router.get('/', function (req, res) {
    const filePath = path.join(__dirname, '../views/index.html');
    res.sendFile(filePath);
    console.log("index.html has sent");
});

router.post('/shorten', async function (req, res) {
    var originalUrl = req.body.url;

    const doc = await db.getDb().collection('URL').findOne({url: originalUrl});
    let encodedId;

    if (doc)
        encodedId = base62.encode(doc._id);
    else {
        let count = counter.get_count();
        const newUrl = {_id: count, url: originalUrl};
        await db.getDb.collection('URL').insertOne(newUrl);
        encodedId = base62.encode(count);
    }
    res.json({url_res: encodedId});
});

router.get('/:encodedId', async function (req, res) {
    let encodedId = req.params.encodedId;
    let decodedId = base62.decode(encodedId);

    const doc = await db.getDb().collection('URL').findOne({_id: decodedId});
    if (doc)
        res.redirect(doc.url);
    else
        res.redirect('/');
    //이거 오류처리해줘야 함
});

module.exports = router;