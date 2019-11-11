import express from 'express';
import bodyParser from 'body-parser';
import {MongoClient} from 'mongodb';

const app = express();
app.use(bodyParser.json());

const withDB = async (actions, res) => {
    try {
        const client = await MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true });
        const db = client.db('demo-blog');

        await actions(db);

        client.close();
    } catch (error) {
        res.status(500).json({ message: 'Error connecting to db', error });        
    }
} 


app.get('/api/articles/:name', (req, res) => {
    const {name} = req.params;

    withDB(async db => {
        const data = await db.collection('articles').findOne({ name })
        res.status(200).json(data);
    }, res);
})

app.post('/api/articles/:name/upvote', (req, res) => {
    const {name} = req.params;
    
    withDB(async db => {
        const data = await db.collection('articles').findOne({ name });
        await db.collection('articles').updateOne({ name }, {
            '$set': { upvotes: data.upvotes + 1 }
        });
        const updated = await db.collection('articles').findOne({ name });
    
        res.status(200).json(updated);
    }, res);
});

app.post('/api/articles/:name/add-comment', (req, res) => {
    const { username, text } = req.body;
    const {name} = req.params;

    withDB(async db => {
        const data = await db.collection('articles').findOne({ name });
        await db.collection('articles').updateOne({ name }, {
            '$set': { comments: data.comments.concat({ username, text }) }
        });
        const updated = await db.collection('articles').findOne({ name });

        res.status(200).json(updated);
    }, res);
});

app.listen(8000, () => console.log('Listening on port 8000'));