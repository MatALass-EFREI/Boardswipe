const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();

app.use(cors());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'admin',
    database: 'BoardSwipe',
});

db.connect(err => {
    if (err) throw err;
    console.log('Connected to database');
});

// Sort by Name
app.get('/games/sortByName', (req, res) => {
    console.log('Request received at /games/sortByName');
    const { order = 'asc' } = req.query;
    const sortOrder = order.toLowerCase() === 'desc' ? 'DESC' : 'ASC';

    const query = `SELECT id_game AS id, gameName AS name, gameYearPublished AS releaseDate
                   FROM game
                   ORDER BY gameName ${sortOrder}`;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error executing query for /games/sortByName:', err);
            throw err;
        }
        console.log('Query successful for /games/sortByName');
        res.json(results);
    });
});

// Sort by Release Date
app.get('/games/sortByReleaseDate', (req, res) => {
    console.log('Request received at /games/sortByReleaseDate');
    const { order = 'asc' } = req.query;
    const sortOrder = order.toLowerCase() === 'desc' ? 'DESC' : 'ASC';

    const query = `SELECT id_game AS id, gameName AS name, gameYearPublished AS releaseDate
                   FROM game
                   ORDER BY gameYearPublished ${sortOrder}`;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error executing query for /games/sortByReleaseDate:', err);
            throw err;
        }
        console.log('Query successful for /games/sortByReleaseDate');
        res.json(results);
    });
});

// Sort by Rating
app.get('/games/sortByRating', (req, res) => {
    console.log('Request received at /games/sortByRating');
    const { order = 'asc' } = req.query;
    const sortOrder = order.toLowerCase() === 'desc' ? 'DESC' : 'ASC';

    const query = `SELECT id_game AS id, gameName AS name, gameYearPublished AS releaseDate, avgRating AS rating
                   FROM game
                   ORDER BY avgRating ${sortOrder}`;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error executing query for /games/sortByRating:', err);
            throw err;
        }
        console.log('Query successful for /games/sortByRating');
        res.json(results);
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

app.get('/', (req, res) => {
    console.log('Request received at /');
    res.send('Welcome to the BoardSwipe API');
});