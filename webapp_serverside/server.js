const express = require('express');
const cors = require('cors'); // Import CORS
const app = express();
const gamesApi = require('./controllers/gamesapi.route');
const authRoutes = require('./controllers/auth.controller'); // Ajoute cette ligne
const swipeApi= require('./controllers/swipe.route');
const adminRoutes = require('./controllers/admin.route');
const userApi = require('./controllers/userapi.route');
const quizApi = require('./controllers/quizapi.route');

// Middleware CORS
app.use(cors({
    origin: /http:\/\/localhost:\d+$/, // Allows any localhost with any port
}));

// Middleware JSON
app.use(express.json());

// Routes
app.use('/games', gamesApi);
app.use('/swipe', swipeApi); // Corrected this line
app.use('/admin', adminRoutes);
app.use('/auth', authRoutes); // Ajoute cette ligne
app.use('/user', userApi); // Ajoute cette ligne
app.use('/quiz', quizApi); // Ajoute cette ligne

// Start server
const port = process.env.WEB_PORT || 9000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});