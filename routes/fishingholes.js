const express = require('express');
const router = express.Router();
const fishingholes = require('../controllers/fishingholes');
const catchAsync = require('../utilities/catchAsync');
const { isLoggedIn, isAuthor, validateFishinghole } = require('../middleware');
const Fishinghole = require('../models/fishingHole');


//INDEX Route
router.get('/', catchAsync(fishingholes.index));

//make a NEW form and serve it 
router.get('/new', isLoggedIn, fishingholes.renderNewForm);

//CREATE--this is where the form is submitted to 
router.post('/', isLoggedIn, validateFishinghole, catchAsync(fishingholes.createFishinghole));

//SHOW (details) Route for a single fishing hole 
router.get('/:id', catchAsync(fishingholes.showFishinghole));


//EDIT and UPDATE
//this route serves the edit/update form 
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(fishingholes.renderEditForm));



//EDIT and UPDATE
//this route submits the edit/update form 
router.put('/:id', isLoggedIn, isAuthor, validateFishinghole, catchAsync(fishingholes.updateFishinghole));


//DELETE a fishing hole 
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(fishingholes.deleteFishinghole));


module.exports = router;