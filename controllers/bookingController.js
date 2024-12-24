// controllers/bookingController.js
const RoomModel = require('../models/roomModel');
const BookingModel = require('../models/bookingModel');
const { v4: uuidv4 } = require('uuid'); // not using UUID for BookingID(1,2,3...)

const BookingController = {
    showBookingForm: async (req, res) => {
        if (!req.session.user) {
            return res.redirect('/user/login');
        }

        try {
            const rooms = await RoomModel.getAvailableRooms();
            res.render('bookingForm', { rooms, error: null });
        } catch (err) {
            console.error(err);
            res.status(500).render('bookingForm', { rooms: [], error: 'Failed to load rooms!' });
        }
    },

    // POST REQUEST
    createBooking: async (req, res) => {
        const { RoomID, NumberOfGuests, CheckInDate, CheckOutDate } = req.body;
        const { user } = req.session;

        try {
            // Fetch the latest BookingID from the database
            const latestBooking = await BookingModel.getLatestBooking();
            let nextBookingID = 'B01'; // Default for the first booking

            if (latestBooking) {
                // Extract the numeric part of the latest BookingID 
                const latestNumber = parseInt(latestBooking.BookingID.substring(1), 10);
                nextBookingID = `B${(latestNumber + 1).toString().padStart(2, '0')}`;
            }

            // Fetch selected room details
            const selectedRoom = await RoomModel.getAvailableRooms()
                .then(rooms => rooms.find(room => room.RoomID === RoomID));
            if (!selectedRoom) {
                return res.render('bookingForm', { rooms: [], error: 'Invalid room selection!' });
            }

            // Calculate total price
            const days = Math.ceil((new Date(CheckOutDate) - new Date(CheckInDate)) / (1000 * 60 * 60 * 24));
            const totalPrice = days * selectedRoom.RoomPricePerDay;

            // Create booking object
            const booking = {
                BookingID: nextBookingID, // Use the generated BookingID
                RoomID,
                UserID: user.UserID,
                NumberOfGuests,
                CheckInDate,
                CheckOutDate,
                BookingTotalPrice: totalPrice,
                BookingStatus: 'Confirmed',
            };

            // Save the booking to the database
            await BookingModel.createBooking(booking);

            // Redirect to the home page after successful booking
            res.redirect('/user/home');
        } catch (err) {
            console.error(err);
            res.status(500).render('bookingForm', { rooms: [], error: 'Failed to create booking!' });
        }
    },

// GET REQUEST
    showUserBookings: async (req, res) => {
        if (!req.session.user) {
            return res.redirect('/user/login');
        }

        const { UserID } = req.session.user;

        try {
            const bookings = await BookingModel.getBookingsByUser(UserID);
            res.render('viewBookings', { user: req.session.user, bookings });
        } catch (err) {
            console.error(err);
            res.status(500).render('viewBookings', { user: req.session.user, bookings: [], error: 'Failed to load bookings!' });
        }
    },

    // UPDATE REQUEST

    showEditForm: async (req, res) => {
        const { BookingID } = req.params;
    
        try {
            // Fetch booking details by ID
            const booking = await BookingModel.getBookingByID(BookingID);
    
            if (!booking) {
                return res.status(404).send('Booking not found.');
            }
    
            res.render('editBookingForm', { booking });
        } catch (err) {
            console.error('Failed to load booking:', err.message);
            res.status(500).send('Failed to load booking.');
        }
    },
//UPDATE BOOKING
    updateBooking: async (req, res) => {
        const { BookingID } = req.params;
        const { NumberOfGuests, CheckOutDate } = req.body;

        try {
            // Ensure BookingID and updated details are passed correctly
            console.log('BookingID:', BookingID);
            console.log('Updated Details:', { NumberOfGuests, CheckOutDate });

            // Call the model function to update the booking
            const updated = await BookingModel.updateBooking(BookingID, {
                NumberOfGuests,
                CheckOutDate,
            });

            if (!updated) {
                return res.status(404).send('Booking not found or update failed.');
            }

            // After update, redirect back to the bookings list page
            res.redirect('/booking');
        } catch (err) {
            console.error('Failed to update booking:', err.message);
            res.status(500).send('Failed to update booking.');
        }
    },
    // Add this method to get a booking by its BookingID
    getBookingByID: async (req, res) => {
        const { BookingID } = req.params;

        try {
            const booking = await BookingModel.getBookingByID(BookingID);
            if (!booking) {
                return res.status(404).send('Booking not found.');
            }
            res.render('viewBookings', { bookings });
        } catch (err) {
            console.error('Error fetching booking:', err.message);
            res.status(500).send('Failed to fetch booking.');
        }
    },

    // DELETE BOOKING
   deleteBooking: async (req, res) => {
    const { BookingID } = req.params;

    try {
        // Make sure the booking exists before trying to delete it
        const booking = await BookingModel.getBookingByID(BookingID);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found or already deleted.' });
        }

        // Call the model function to delete the booking
        const deleted = await BookingModel.deleteBooking(BookingID);

        if (!deleted) {
            return res.status(404).json({ message: 'Failed to delete booking.' });
        }

        // Send a success response
        res.status(200).json({ message: 'Booking deleted successfully.' });
    } catch (err) {
        console.error('Failed to delete booking:', err.message);
        res.status(500).json({ message: 'Failed to delete booking.' });
    }
},
};


module.exports = BookingController;
