const express = require('express');
const path = require('path');
const data = require('./db/db.json');
const PORT = 3001;

const app = express();

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('/api', (req, res) => res.json(data));

app.listen(PORT, () => {
  console.log(`Application listening at http://localhost:${PORT}`);
});