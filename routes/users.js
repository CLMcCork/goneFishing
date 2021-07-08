const express = require('express');
const router = express.Router(); 
const passport = require('passport');
const catchAsync = require('../utilities/catchAsync');
const User = require('../models/user'); 
const users = require('../controllers/users');


router.route('/register')
    //shows the register form 
    .get(users.renderRegister)
    //creates the new user (form is submitted)
    .post(catchAsync (users.register));



router.route('/login')
    //login route to serve the form 
    .get(users.renderLogin)
    //this route actually logins in the user and makes sure the credentials are valid 
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login);


//logout
router.get('/logout', users.logout);


module.exports = router; 