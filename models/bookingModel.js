const sql = require('mssql');

const BookingModel = {
    // Fetch the latest booking for determining the next BookingID
    getLatestBooking: async () => {
        try {
            const pool = await sql.connect();
            const result = await pool.request().query(`
                SELECT TOP 1 BookingID 
                FROM CW2.Booking 
                ORDER BY BookingID DESC
            `);
            return result.recordset[0]; // Return the latest booking
        } catch (err) {
            console.error(err);
            throw new Error('Failed to fetch latest booking.');
        }
    },

    // Create a new booking
    createBooking: async (booking) => {
        try {
            const pool = await sql.connect();
            await pool.request()
                .input('BookingID', sql.VarChar(10), booking.BookingID)
                .input('RoomID', sql.VarChar(10), booking.RoomID)
                .input('UserID', sql.VarChar(10), booking.UserID)
                .input('NumberOfGuests', sql.Int, booking.NumberOfGuests)
                .input('CheckInDate', sql.Date, booking.CheckInDate)
                .input('CheckOutDate', sql.Date, booking.CheckOutDate)
                .input('BookingTotalPrice', sql.Decimal(10, 2), booking.BookingTotalPrice)
                .input('BookingStatus', sql.VarChar(50), booking.BookingStatus)
                .execute('CW2.CreateBooking');
        } catch (err) {
            console.error(err);
            throw new Error('Failed to create booking.');
        }
    },

    // Fetch all bookings for a particular user
    getBookingsByUser: async (userID) => {
        try {
            const pool = await sql.connect(); // Ensure connection to the SQL server
            const query = `
                SELECT * FROM CW2.Booking WHERE UserID = @UserID;
            `;
            const result = await pool.request()
                .input('UserID', sql.VarChar(10), userID)
                .query(query);

            return result.recordset || [];
        } catch (err) {
            console.error('Database Error:', err.message);
            throw err; // Re-throw the error to handle it at the controller level
        }
    },
    
};

module.exports = BookingModel;
