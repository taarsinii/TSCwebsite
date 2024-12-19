// server.js
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const userRoutes = require('./routes/userRoutes');
const roomRoutes = require('./routes/roomRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const methodOverride = require('method-override');
const path = require('path');

const app = express();


// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'secret-key', resave: false, saveUninitialized: true }));

// Set EJS as the template engine
app.set('view engine', 'ejs');

// Set the views directory using __dirname to resolve the absolute path
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));
// Use method-override to support PUT and DELETE methods in forms
app.use(methodOverride('_method'));


// Routes
app.use('/user', userRoutes);
app.use('/rooms', roomRoutes);
// Add booking routes
app.use('/booking', bookingRoutes);
// Define routes
app.use('/bookings', bookingRoutes);



// Start server
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
