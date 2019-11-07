import express from 'express';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());

const mockData = {
    'learn-react': {
        upvotes: 0,
        comments: [],
    },
    'learn-node': {
        upvotes: 0,
        comments: [],
    },
    'my-thoughts-on-resumes': {
        upvotes: 0,
        comments: [],
    },
}

app.post('/api/articles/:name/like', (req, res) => {
    const article = req.params.name;

    mockData[article].upvotes += 1;
    res.status(200).send(`${article} now has ${mockData[article].upvotes} upvotes!`);
});

app.post('/api/articles/:name/comment', (req, res) => {
    const { username, text } = req.body;
    const article = req.params.name;

    mockData[article].comments.push({ username, text });

    res.status(200).send(mockData[article]);
});

app.listen(8000, () => console.log('Listening on port 8000'));