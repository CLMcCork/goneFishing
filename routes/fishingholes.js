const express = require('express');
const router = express.Router();
const fishingholes = require('../controllers/fishingholes');
const catchAsync = require('../utilities/catchAsync');
const { isLoggedIn, isAuthor, validateFishinghole } = require('../middleware');
const Fishinghole = require('../models/fishingHole');
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });

router.route('/')
    //INDEX Route
    .get(catchAsync(fishingholes.index))
    //CREATE--this is where the form is submitted to 
    //.post(isLoggedIn, validateFishinghole, catchAsync(fishingholes.createFishinghole));
    .post(upload.array('image'), (req, res) => {
        console.log(req.body, req.files);
        res.send("it worked!!");
    });

//make a NEW form and serve it 
router.get('/new', isLoggedIn, fishingholes.renderNewForm);


router.route('/:id')
    //SHOW (details) Route for a single fishing hole 
    .get(catchAsync(fishingholes.showFishinghole))
    //EDIT and UPDATE
    //this route submits the edit/update form 
    .put(isLoggedIn, isAuthor, validateFishinghole, catchAsync(fishingholes.updateFishinghole))
    //DELETE a fishing hole 
    .delete(isLoggedIn, isAuthor, catchAsync(fishingholes.deleteFishinghole));


//EDIT and UPDATE
//this route serves the edit/update form 
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(fishingholes.renderEditForm));









module.exports = router;