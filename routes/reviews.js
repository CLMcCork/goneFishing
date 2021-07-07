const express = require('express');
const router = express.Router({ mergeParams: true });
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
const Fishinghole = require('../models/fishingHole');
const Review = require('../models/review');
const ExpressError = require('../utilities/ExpressError');
const catchAsync = require('../utilities/catchAsync');


//POST (submits the data from the review form)
router.post('/', isLoggedIn, validateReview, catchAsync(async (req, res) => {
    //use the id to find the fishinghole 
    const fishinghole = await Fishinghole.findById(req.params.id);
    //make a new review
    const review = new Review(req.body.review);
    review.author = req.user._id;
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
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Fishinghole.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review!');
    res.redirect(`/fishingholes/${id}`);
}));


module.exports = router;