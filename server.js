const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const uuidv4 = require('uuid/v4');

const store = './store/articles.json';

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
  next();
}
app.use(allowCrossDomain);

app.get('/api/articles', (req, res) => {
  fs.readFile(store, 'utf8', function readFileCallback(err, data){
    const articles = JSON.parse(data);
    res.json({ articles });
  });
});

app.get('/api/articles/:id', (req, res) => {
  const {id} = req.params;
  const articles = require('./store/articles');
  const article = articles.filter(article => article.id === id)[0]

  if (!article) {
    return res.status(404).json({message: 'Not found'});
  }
  res.json({ article });
});

app.post('/api/article', (req, res) => {
  const newArticle = req.body;
  const {title, body, categories} = newArticle;

  if (!title || !body || categories.length < 1) {
    return res.status(400).json({message: 'Bad request'});
  }

  fs.readFile(store, 'utf8', function readFileCallback(err, data){
    const articles = JSON.parse(data);
    newArticle.date_created = new Date().toUTCString();
    newArticle.id = uuidv4();
    articles.unshift(newArticle);
    fs.writeFile(store, JSON.stringify(articles), 'utf8', function (err) {
       if (err) return console.log(err);
    });
  });

  res.json({message: 'Success'});
});

app.delete('/api/article/:id', async (req, res) => {
  const {id} = req.params;
  if (!id) {
    return res.status(400).json({message: 'Bad request'});
  }

  await fs.readFile(store, 'utf8', function readFileCallback(err, data){
    const articles = JSON.parse(data);
    const updatedArticles = articles.filter(article => article.id !== id);
    fs.writeFile(store, JSON.stringify(updatedArticles), 'utf8', function (err) {
       if (err) return console.log(err);
    });
  });

  res.json({message: 'Success'});
});

app.listen(port, () => console.log(`Listening on port ${port}`));

