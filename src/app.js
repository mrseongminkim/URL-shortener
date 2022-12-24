const express = require('express');

const urlShortenerRoutes = require('./routes/url_shortener');
const db = require('./data/database');

const app = express();

app.use(express.static('public'));
app.use(express.json());

app.use(urlShortenerRoutes);

app.use(function(error, req, res, next) {
    console.log(error);
    res.status(500).send(error);
});

db.connectToDatabase().then(function() {
    console.log("Server is started");
    app.listen(3000);
});