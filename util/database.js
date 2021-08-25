require('custom-env').env('staging');
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const mongoConnect = (callback) => {
    MongoClient.connect(`mongodb+srv://stacy:${process.env.MONGODB_PASSWORD}@cluster0.3frzt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`)
        .then(client => {
            console.log('Connected!');
            callback(client);
        })
        .catch(err => console.log(err));
}

module.exports = mongoConnect;