const express = require('express');
const app = express();
const gamesApi = require('./controllers/gamesapi.route');

// Middleware
app.use(express.json());

// Routes
app.use('/games', gamesApi);

// Start server
const port = process.env.WEB_PORT || 9000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});