const ExpressError = require('./utilities/ExpressError');
const { fishingholeSchema, reviewSchema } = require('./schemas.js'); //JOI schema
const Fishinghole = require('./models/fishingHole');
const Review = require('./models/review');

module.exports.isLoggedIn = (req, res, next) => {
    //console.log('REQ.USER', req.user);
    if(!req.isAuthenticated()){ //if not authenticated 
        req.session.returnTo = req.originalUrl; //BUG!!!
        req.flash('error', 'Whoops! Please sign in first!');
        return res.redirect('/login');
     }
     next(); //otherwise, call next() (if you are authenticated, good to go)
}

//function to validate fishinghole w/ JOI validation middleware
module.exports.validateFishinghole = (req, res, next) => {
    const { error } = fishingholeSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}


//middleware to verify if the author === current logged in user
module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const fishinghole = await Fishinghole.findById(id);
     if(!fishinghole.author.equals(req.user._id)) { //if current user logged in doesn't own the fishinghole
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/fishingholes/${id}`);
     }
     next();
 }

 //middleware to verify the reviewAuthor
 module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId} = req.params;
    const review = await Review.findById(reviewId);
     if(!review.author.equals(req.user._id)) { 
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/fishingholes/${id}`);
     }
     next();
 }
 

 //function to validate reviews w/ JOI validation middleware
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body); 
    if(error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}