// controllers/bookingController.js
const RoomModel = require('../models/roomModel');
const BookingModel = require('../models/bookingModel');
const { v4: uuidv4 } = require('uuid'); // This can be removed if you are no longer using UUID for BookingID

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

    createBooking: async (req, res) => {
        const { RoomID, NumberOfGuests, CheckInDate, CheckOutDate } = req.body;
        const { user } = req.session;

        try {
            // Fetch the latest BookingID from the database
            const latestBooking = await BookingModel.getLatestBooking();
            let nextBookingID = 'B01'; // Default for the first booking

            if (latestBooking) {
                // Extract the numeric part of the latest BookingID and increment
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
};

module.exports = BookingController;
