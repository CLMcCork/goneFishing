module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){ //if not authenticated 
        req.flash('error', 'Whoops! Please sign in first!');
        return res.redirect('/login');
     }
     next(); //otherwise, call next() (if you are authenticated, good to go)
}
