const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();

app.use(cors());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Chipie36', 
  database: 'boardgamecommunity',
});

db.connect(err => {
  if (err) throw err;
  console.log('Connected to database');
});

app.get('/games', (req, res) => {
  db.query('SELECT id_game AS id, gameName AS name, gameYearPublished AS releaseDate FROM game', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
