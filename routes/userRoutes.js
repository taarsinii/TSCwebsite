// routes/userRoutes.js 
const express = require('express'); 
const router = express.Router(); 
const UserController = require('../controllers/userController'); 
// Login routes 
router.get('/login', (req, res) => res.render('login', { error: null, success: null })); 
router.post('/login', UserController.login); 
// Home route 
router.get('/home', UserController.home); 
// Logout route 
router.get('/logout', UserController.logout); 
module.exports = router; 