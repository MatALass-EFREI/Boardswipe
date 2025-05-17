const express = require('express');
const cors = require('cors'); // mets ça en haut
const app = express();
const gamesApi = require('./controllers/gamesapi.route');

// Middleware CORS
app.use(cors({
    origin: 'http://localhost:8081'
}));

// Middleware JSON
app.use(express.json());

// Routes
app.use('/games', gamesApi);

// Start server
const port = process.env.WEB_PORT || 9000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
