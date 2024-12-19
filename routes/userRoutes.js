// routes/userRoutes.js 
const express = require('express'); 
const router = express.Router(); 
const UserController = require('../controllers/userController'); 
const BookingController = require('../controllers/bookingController');

// Login routes 
router.get('/login', (req, res) => res.render('login', { error: null, success: null })); 
router.post('/login', UserController.login); 
// Home route 
router.get('/home', UserController.home); 
// Account route
router.get('/account', UserController.account);
// Route to show user bookings
router.get('/bookings', BookingController.showUserBookings);
// Logout route 
router.get('/logout', UserController.logout); 
//View Booking return back to home
router.get('/home', UserController.showHomePage);
module.exports = router; 