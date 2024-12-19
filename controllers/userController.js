// controllers/userController.js
const UserModel = require('../models/userModel');

const UserController = {
 login: async (req, res) => {
 const { email, password } = req.body;

 if (!email || !password) {
 return res.render('login', { error: 'Email and Password are required!', success: null });
 }

 try {
 // Look for the user with the provided email and password
 const user = await UserModel.findByEmailAndPassword(email, password);

 if (!user) {
 return res.render('login', { error: 'Invalid email or password!', success: null });
 }

 // Save user session
 req.session.user = user;

 // Redirect to the home page if login is successful
 return res.redirect('/user/home');
 } catch (err) {
 console.error(err);
 res.status(500).render('login', { error: 'Internal Server Error', success: null });
 }
 },

 home: (req, res) => {
 if (!req.session.user) {
 return res.redirect('/user/login'); // Redirect to login if no session
 }

 res.render('home', { user: req.session.user });
 },

 account: (req, res) => {
 if (!req.session.user) {
 return res.redirect('/user/login'); // Redirect to login if not logged in
 }

 res.render('account', { user: req.session.user });
 },
 //ADD RETURN HOME BUTTON IN VIEW BOOKING PAGE
 showHomePage: (req, res) => {
    if (!req.session.user) {
        return res.redirect('/user/login');
    }
    res.render('home', { user: req.session.user });
},


 logout: (req, res) => {
 req.session.destroy(() => {
 res.redirect('/user/login'); // Redirect to login on logout
 });
 }
};

// Exporting the UserController
module.exports = UserController;