// models/roomModel.js
const sql = require('mssql');
const dbConfig = require('../dbConfig');

const RoomModel = {
    getAllRooms: async () => {
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .query('SELECT RoomCategory, RoomPricePerDay, RoomAvailabilityStatus FROM CW2.[Room]');
        return result.recordset;
    },

    getAvailableRooms: async () => {
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .query('SELECT RoomID, RoomCategory, RoomPricePerDay FROM CW2.[Room] WHERE RoomAvailabilityStatus = \'Available\'');
        return result.recordset;
    },
};

module.exports = RoomModel;
