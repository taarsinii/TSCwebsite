// routes/roomRoutes.js
const express = require('express');
const router = express.Router();
const RoomController = require('../controllers/roomController');

// View Rooms route
router.get('/view', RoomController.viewRooms);

module.exports = router;
