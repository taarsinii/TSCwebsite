// routes/bookingRoutes.js
const express = require('express');
const router = express.Router();
const BookingController = require('../controllers/bookingController');

// Booking routes
router.get('/new', BookingController.showBookingForm);
router.post('/new', BookingController.createBooking);

// Route to display bookings for a logged-in user
router.get('/', BookingController.showUserBookings);

// Route to view a specific booking by BookingID
router.get('/view/:BookingID', BookingController.getBookingByID);  // Add this route

// FOR UPDATE REQUEST
// Route to show edit form
router.get('/edit/:BookingID', BookingController.showEditForm);

// Route to handle booking update
router.put('/edit/:BookingID', BookingController.updateBooking);

// DELETE request to handle deleting a booking
router.delete('/delete/:BookingID', BookingController.deleteBooking);


module.exports = router;
