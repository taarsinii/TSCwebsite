// routes/bookingRoutes.js
const express = require('express');
const router = express.Router();
const BookingController = require('../controllers/bookingController');

// Booking routes
router.get('/new', BookingController.showBookingForm);
router.post('/new', BookingController.createBooking);

// Route to display bookings for a logged-in user
router.get('/', BookingController.showUserBookings);

module.exports = router;
