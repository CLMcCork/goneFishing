const express = require('express');
const router = express.Router(); 
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


module.exports = router; 