// controllers/roomController.js
const RoomModel = require('../models/roomModel');

const RoomController = {
    viewRooms: async (req, res) => {
        if (!req.session.user) {
            return res.redirect('/user/login'); // Redirect to login if not authenticated
        }

        try {
            const rooms = await RoomModel.getAllRooms();
            res.render('roomList', { rooms });
        } catch (err) {
            console.error(err);
            res.status(500).render('roomList', { rooms: [], error: 'Failed to load rooms!' });
        }
    },
};

module.exports = RoomController;
