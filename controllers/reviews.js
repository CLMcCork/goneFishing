const Fishinghole = require('../models/fishingHole');
const Review = require('../models/review');


module.exports.createReview = async (req, res) => {
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
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Fishinghole.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review!');
    res.redirect(`/fishingholes/${id}`);
}