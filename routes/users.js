const express = require('express');
const router = express.Router(); 
const User = require('../models/user'); 

//shows the register form 
router.get('/register', (req, res) => {
    res.render('users/register');
});

//creates the new user (form is submitted)
router.post('/register', async(req, res) => {
    //to make sure getting email, username and password: 
    res.send(req.body); 

});


module.exports = router; 