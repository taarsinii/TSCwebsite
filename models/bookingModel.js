// models/bookingModel.js
const sql = require('mssql');
const dbConfig = require('../dbConfig');

const BookingModel = {
    createBooking: async (booking) => {
        const { BookingID, RoomID, UserID, NumberOfGuests, CheckInDate, CheckOutDate, BookingTotalPrice, BookingStatus } = booking;
        const pool = await sql.connect(dbConfig);
        await pool.request()
            .input('BookingID', sql.VarChar, BookingID)
            .input('RoomID', sql.VarChar, RoomID)
            .input('UserID', sql.VarChar, UserID)
            .input('NumberOfGuests', sql.Int, NumberOfGuests)
            .input('CheckInDate', sql.Date, CheckInDate)
            .input('CheckOutDate', sql.Date, CheckOutDate)
            .input('BookingTotalPrice', sql.Decimal(10, 2), BookingTotalPrice)
            .input('BookingStatus', sql.VarChar, BookingStatus)
            .execute('CW2.CreateBooking');
    },
};

module.exports = BookingModel;
