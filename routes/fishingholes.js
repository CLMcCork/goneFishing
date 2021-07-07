const express = require('express');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync');
const { isLoggedIn, isAuthor, validateFishinghole } = require('../middleware');
const Fishinghole = require('../models/fishingHole');


//INDEX Route
router.get('/', catchAsync(async (req, res) => {
    const fishingholes = await Fishinghole.find({});
    res.render('fishingholes/index', { fishingholes });
}));

//make a NEW form and serve it 
router.get('/new', isLoggedIn, (req, res) => {
    res.render('fishingholes/new');
});

//CREATE--this is where the form is submitted to 
router.post('/', isLoggedIn, validateFishinghole, catchAsync(async (req, res, next) => {
    const fishinghole = new Fishinghole(req.body.fishinghole);
    fishinghole.author = req.user._id;
    await fishinghole.save();
    req.flash('success', 'Thanks for adding your Fishing Hole info!')
    res.redirect(`/fishingholes/${fishinghole._id}`);
}));

//SHOW (details) Route for a single fishing hole 
router.get('/:id', catchAsync(async (req, res) => {
    const fishinghole = await (Fishinghole.findById(req.params.id).populate({
        path:'reviews',
        populate: { 
            path: 'author'
        }
      }).populate('author'));
    console.log(fishinghole);
    if(!fishinghole) {//if didn't find fishinghole w/ that id, flash this error and redirect
        req.flash('error', "Oh no! We cannot find that Fishing Hole!");
        return res.redirect('/fishingholes');
    }
    res.render('fishingholes/show', { fishinghole });
}));


//EDIT and UPDATE
//this route serves the edit/update form 
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    const fishinghole = await Fishinghole.findById(id);
    if(!fishinghole) {
        req.flash('error', "Oh no! We cannot find that Fishing Hole!");
        return res.redirect('/fishingholes');
    }
    res.render('fishingholes/edit', { fishinghole });
}));



//EDIT and UPDATE
//this route submits the edit/update form 
router.put('/:id', isLoggedIn, isAuthor, validateFishinghole, catchAsync(async (req, res) => {
    const { id } = req.params;
    const fishinghole = await Fishinghole.findByIdAndUpdate(id, {...req.body.fishinghole});
    req.flash('success', 'Successfully updated Fishing Hole!');
    res.redirect(`/fishingholes/${fishinghole._id}`);
}));


//DELETE a fishing hole 
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Fishinghole.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted a Fishing Hole!');
    res.redirect('/fishingholes');
}));

module.exports = router;