// models/userModel.js 
const sql = require('mssql'); 
const dbConfig = require('../dbConfig'); 
const UserModel = { 
findByEmailAndPassword: async (email, password) => { 
const pool = await sql.connect(dbConfig); 
const result = await pool.request() 
.input('EmailAddress', sql.VarChar, email) 
.input('AuthPassword', sql.VarChar, password) 
.query('SELECT * FROM CW2.[User] WHERE EmailAddress = @EmailAddress AND AuthPassword = @AuthPassword'); 
return result.recordset[0]; 
}, 
}; 
module.exports = UserModel; 