// controllers/bookingController.js
const RoomModel = require('../models/roomModel');
const BookingModel = require('../models/bookingModel');
const { v4: uuidv4 } = require('uuid'); // Use UUID for unique BookingID generation

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
            const selectedRoom = await RoomModel.getAvailableRooms()
                .then(rooms => rooms.find(room => room.RoomID === RoomID));
            if (!selectedRoom) {
                return res.render('bookingForm', { rooms: [], error: 'Invalid room selection!' });
            }

            const days = Math.ceil((new Date(CheckOutDate) - new Date(CheckInDate)) / (1000 * 60 * 60 * 24));
            const totalPrice = days * selectedRoom.RoomPricePerDay;

            const booking = {
                BookingID: uuidv4(),
                RoomID,
                UserID: user.UserID,
                NumberOfGuests,
                CheckInDate,
                CheckOutDate,
                BookingTotalPrice: totalPrice,
                BookingStatus: 'Confirmed',
            };

            await BookingModel.createBooking(booking);

            res.redirect('/user/home');
        } catch (err) {
            console.error(err);
            res.status(500).render('bookingForm', { rooms: [], error: 'Failed to create booking!' });
        }
    },
};

module.exports = BookingController;
