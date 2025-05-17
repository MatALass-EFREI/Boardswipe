const express = require('express');
const cors = require('cors'); // Import CORS
const app = express();
const gamesApi = require('./controllers/gamesapi.route');
const swipeApi = require('./controllers/swipe.route');

// Middleware CORS
app.use(cors({
    origin: 'http://localhost:8081'
}));

// Middleware JSON
app.use(express.json());

// Routes
app.use('/games', gamesApi);
app.use('/swipe', swipeApi); // Corrected this line

// Start server
const port = process.env.WEB_PORT || 9000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});