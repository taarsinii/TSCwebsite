// routes/bookingRoutes.js
const express = require('express');
const router = express.Router();
const BookingController = require('../controllers/bookingController');

// Booking routes
router.get('/new', BookingController.showBookingForm);
router.post('/new', BookingController.createBooking);

module.exports = router;
