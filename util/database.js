const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = cb => {
    MongoClient.connect('mongodb+srv://ariefirawant:dksq7mT60cz1Qdnj@cluster0-fv6bh.mongodb.net/shop?retryWrites=true&w=majority')
    .then(client => {
        console.log('Connected!');
        _db = client.db();
        cb();
    })
    .catch(err => {
        console.log(err)
        throw err;
    });
}

const getDb = ()  => {
    if (_db) {
        return _db;
    }
    throw 'No Database found!';
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;