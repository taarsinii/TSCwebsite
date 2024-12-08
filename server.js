const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();

// Import routes
const userRoutes = require('./routes/userRoutes');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({ secret: 'your-secret-key', resave: false, saveUninitialized: true }));

// Set view engine
app.set('view engine', 'ejs');

// Use userRoutes with the '/user' prefix
app.use('/user', userRoutes);

// Start the server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
