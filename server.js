const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3001;

app.use(bodyParser.json());
app.use(express.static('public'));

// GET /notes
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/notes.html'));
});

// GET /index.js - Serve the index.js file
app.get('/index.js', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/assets/js/index.js'));
});

// GET *
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

// GET /api/notes
app.get('/api/notes', (req, res) => {
  fs.readFile(path.join(__dirname, 'db/db.json'), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Unable to read notes.' });
    } else {
      try {
        const notes = JSON.parse(data);
        res.json(notes);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Unable to parse notes.' });
      }
    }
  });
});

// POST /api/notes
app.post('/api/notes', (req, res) => {
  fs.readFile(path.join(__dirname, 'db/db.json'), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Unable to read notes.' });
    } else {
      try {
        const notes = JSON.parse(data);
        const newNote = req.body;
        newNote.id = uuidv4(); // Use a unique ID for the new note

        notes.push(newNote);

        fs.writeFile(path.join(__dirname, 'db/db.json'), JSON.stringify(notes), (err) => {
          if (err) {
            console.error(err);
            res.status(500).json({ error: 'Unable to save note.' });
          } else {
            res.json(newNote);
          }
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Unable to parse notes.' });
      }
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`);
});
