module.exports.isLoggedIn = (req, res, next) => {
    console.log('REQ.USER', req.user);
    if(!req.isAuthenticated()){ //if not authenticated 
        req.session.returnTo = req.originalUrl; //BUG!!!
        req.flash('error', 'Whoops! Please sign in first!');
        return res.redirect('/login');
     }
     next(); //otherwise, call next() (if you are authenticated, good to go)
}
