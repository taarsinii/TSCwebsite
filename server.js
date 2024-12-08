const express = require("express");
const bodyParser = require("body-parser");
const sql = require("mssql");

// Initialize Express App
const app = express();

// Middleware for Parsing JSON Requests
app.use(bodyParser.json());

// SQL Server Configuration
const dbConfig = {
    user: "SA", // Replace with your SQL username
    password: "C0mp2001!", // Replace with your SQL password
    server: "localhost",
    database: "TSChotelDB", // Replace with your database name
    options: {
        encrypt: false, // Set to true if using Azure SQL
        enableArithAbort: true,
    },
};

// Test Database Connection
sql.connect(dbConfig)
    .then(() => {
        console.log("Connected to the database successfully.");
    })
    .catch((err) => {
        console.error("Database connection failed:", err.message);
    });

// Import and Use Routes
const bookingRoutes = require("./routes/booking");
app.use("/api/booking", bookingRoutes);

// Root Endpoint for Testing
app.get("/", (req, res) => {
    res.send("Welcome to the Hotel Booking API!");
});

// Start the Server
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = { app, sql, dbConfig };
