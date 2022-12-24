const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

let database;

async function connect() {
    const client = await MongoClient.connect('mongodb://localhost:27017');
    database = client.db('URL_shortener');
}

function getDb() {
    if (!database)
        throw { message: 'Database connection has not established' };
    return database;
}

module.exports = {
    connectToDatabase: connect,
    getDb: getDb
}