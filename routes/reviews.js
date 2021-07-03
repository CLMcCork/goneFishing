const express = require('express');
const router = express.Router({ mergeParams: true });

const catchAsync = require('../utilities/catchAsync');
const ExpressError = require('../utilities/ExpressError');
const { reviewSchema } = require('../schemas.js');

const Fishinghole = require('../models/fishingHole');
const Review = require('../models/review');


//function to validate reviews w/ JOI validation middleware
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body); 
    if(error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}



//POST (submits the data from the review form)
router.post('/', validateReview, catchAsync(async (req, res) => {
    //use the id to find the fishinghole 
    const fishinghole = await Fishinghole.findById(req.params.id);
    //make a new review
    const review = new Review(req.body.review);
    //push onto fishinghole.reviews the new review
    fishinghole.reviews.push(review);
    //save
    await review.save();
    await fishinghole.save(); 
    req.flash('success', 'Created new review!');
    //redirect back to the fishinghole show page
    res.redirect(`/fishingholes/${fishinghole._id}`);
}));


//DELETE route to delete a review for a fishinghole 
router.delete('/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Fishinghole.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review!');
    res.redirect(`/fishingholes/${id}`);
}));


module.exports = router;