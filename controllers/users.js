const User = require('../models/user'); 

module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}

module.exports.register = async(req, res) => {
    try {
        //to make sure getting email, username and password: res.send(req.body); 
        const { email, username, password } = req.body; //grab these 3 things from req.body
        //pass email and username in an object to new User and save to user variable 
        const user = new User({ email, username });
        //call User.register to take new User instance and password, hash, store salts, and add password
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if(err) return next(err);
            req.flash('success', 'Welcome to Gone Fishing!');
            res.redirect('/fishingholes');
        })
    } catch(e) {
        req.flash('error', e.message);
        res.redirect('register'); 
    }
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login');
}


module.exports.login = (req, res) => {
    //if make it into this part, know that the user was authenticated successfully
    req.flash('success', 'Welcome back!');
    const redirectUrl = req.session.returnTo || '/fishingholes';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', 'Goodbye!');
    res.redirect('/fishingholes');
}