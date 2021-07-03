const express = require('express');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync');
const ExpressError = require('../utilities/ExpressError');
const Fishinghole = require('../models/fishingHole');
const { fishingholeSchema } = require('../schemas.js');


//function to validate fishinghole w/ JOI validation middleware
const validateFishinghole = (req, res, next) => {
    const { error } = fishingholeSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}



//INDEX Route
router.get('/', catchAsync(async (req, res) => {
    const fishingholes = await Fishinghole.find({});
    res.render('fishingholes/index', { fishingholes });
}));

//make a NEW form and serve it 
router.get('/new', (req, res) => {
    res.render('fishingholes/new');
});

//CREATE--this is where the form is submitted to 
router.post('/', validateFishinghole, catchAsync(async (req, res, next) => {
    const fishinghole = new Fishinghole(req.body.fishinghole);
    await fishinghole.save();
    req.flash('success', 'Thanks for adding your Fishing Hole info!')
    res.redirect(`/fishingholes/${fishinghole._id}`);
}));

//SHOW (details) Route for a single fishing hole 
router.get('/:id', catchAsync(async (req, res) => {
    const fishinghole = await Fishinghole.findById(req.params.id).populate('reviews');
    //console.log(fishinghole);
    res.render('fishingholes/show', { fishinghole });
}));


//EDIT and UPDATE
//this route serves the edit/update form 
router.get('/:id/edit', catchAsync(async (req, res) => {
    const fishinghole = await Fishinghole.findById(req.params.id);
    res.render('fishingholes/edit', { fishinghole });
}));



//EDIT and UPDATE
//this route submits the edit/update form 
router.put('/:id', validateFishinghole, catchAsync(async (req, res) => {
    const { id } = req.params;
    const fishinghole = await Fishinghole.findByIdAndUpdate(id, {...req.body.fishinghole});
    req.flash('success', 'Successfully updated Fishing Hole!');
    res.redirect(`/fishingholes/${fishinghole._id}`);
}));


//DELETE a fishing hole 
router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Fishinghole.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted a Fishing Hole!');
    res.redirect('/fishingholes');
}));

module.exports = router;