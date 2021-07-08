const express = require('express');
const router = express.Router({ mergeParams: true });
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
const Fishinghole = require('../models/fishingHole');
const Review = require('../models/review');
const reviews = require('../controllers/reviews');
const ExpressError = require('../utilities/ExpressError');
const catchAsync = require('../utilities/catchAsync');


//POST (submits the data from the review form)
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview));


//DELETE route to delete a review for a fishinghole 
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));


module.exports = router;