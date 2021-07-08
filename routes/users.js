const express = require('express');
const router = express.Router(); 
const passport = require('passport');
const catchAsync = require('../utilities/catchAsync');
const User = require('../models/user'); 
const users = require('../controllers/users');

//shows the register form 
router.get('/register', users.renderRegister);

//creates the new user (form is submitted)
router.post('/register', catchAsync (users.register));


//login route to serve the form 
router.get('/login', users.renderLogin);


//this route actually logins in the user and makes sure the credentials are valid 
router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login);


//logout
router.get('/logout', users.logout);


module.exports = router; 