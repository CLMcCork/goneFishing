const express = require('express');
const router = express.Router(); 
const passport = require('passport');
const catchAsync = require('../utilities/catchAsync');
const User = require('../models/user'); 

//shows the register form 
router.get('/register', (req, res) => {
    res.render('users/register');
});

//creates the new user (form is submitted)
router.post('/register', catchAsync (async(req, res) => {
    try {
        //to make sure getting email, username and password: res.send(req.body); 
        const { email, username, password } = req.body; //grab these 3 things from req.body
        //pass email and username in an object to new User and save to user variable 
        const user = new User({ email, username });
        //call User.register to take new User instance and password, hash, store salts, and add password
        const registeredUser = await User.register(user, password);
        req.flash('success', 'Welcome to Gone Fishing!');
        res.redirect('/fishingholes');
    } catch(e) {
        req.flash('error', e.message);
        res.redirect('register'); 
    }
}));


//login route to serve the form 
router.get('/login', (req, res) => {
    res.render('users/login');
});


//this route actually logins in the user and makes sure the credentials are valid 
router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    //if make it into this part, know that the user was authenticated successfully
    req.flash('success', 'Welcome back!');
    res.redirect('/fishingholes');
});


//logout
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'Goodbye!');
    res.redirect('/fishingholes');
});


module.exports = router; 