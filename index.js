const express = require('express');
const mongodb = require('mongodb');
const bodyParser = require('body-parser');
const cors = require('cors');

const api = express();
api.use(bodyParser.json());
api.use(cors());

api.post('/events', async (req, res, next) => {
    try {
        const data = req.body;
        console.log(data);
    
        // TODO: input validation
        const event = {
            'title': data.title,
            'description': data.description,
            'startTime': new Date(data.startTime),
            'endTime': new Date(data.endTime),
        };
    
        const db = await connect();
        const colEvents = db.collection('events');
        await insert(colEvents, event);
        return res.send('Received a POST HTTP method');
    } catch (err) {
        next(err);
    }
});

async function insert(collection, value) {
    return new Promise((resolve, reject) => {
        collection.insertMany([value], (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        }) 
    });
}

async function connect() {
    const MongoClient = require('mongodb').MongoClient;
    const url = 'mongodb://localhost:27017';
    const dbName = 'damourxyz';
    const client = new mongodb.MongoClient(url, {'useUnifiedTopology': true});
    return new Promise((resolve, reject) => {
        client.connect((err, client) => {
            if (err) {
                reject(err);
            } else {
                resolve(client.db(dbName));
            }
        });
    });
}

const port = 3939;
api.listen(port, () => console.log(`Listening at http://localhost:${port}`));