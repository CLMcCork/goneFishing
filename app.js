const express = require('express');
const path = require('path'); 
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const { fishingholeSchema, reviewSchema } = require('./schemas.js');
const catchAsync = require('./utilities/catchAsync');
const ExpressError = require('./utilities/ExpressError');
const methodOverride = require('method-override');
const Fishinghole = require('./models/fishingHole');
const Review = require('./models/review');

mongoose.connect('mongodb://localhost:27017/fishing-hole', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => {
    console.log('Database connected!');
});

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); 

mongoose.set('useFindAndModify', false);

//this parses request.body so can see what user types in form 
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

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


app.get('/', (req, res) => {
    res.render('home');
});

//INDEX Route
app.get('/fishingholes', catchAsync(async (req, res) => {
    const fishingholes = await Fishinghole.find({});
    res.render('fishingholes/index', { fishingholes });
}));

//make a NEW form and serve it 
app.get('/fishingholes/new', (req, res) => {
    res.render('fishingholes/new');
});

//CREATE--this is where the form is submitted to 
app.post('/fishingholes', validateFishinghole, catchAsync(async (req, res, next) => {
    const fishinghole = new Fishinghole(req.body.fishinghole);
    await fishinghole.save();
    res.redirect(`/fishingholes/${fishinghole._id}`);
}));

//SHOW (details) Route for a single fishing hole 
app.get('/fishingholes/:id', catchAsync(async (req, res) => {
    const fishinghole = await Fishinghole.findById(req.params.id).populate('reviews');
    //console.log(fishinghole);
    res.render('fishingholes/show', { fishinghole });
}));


//EDIT and UPDATE
//this route serves the edit/update form 
app.get('/fishingholes/:id/edit', catchAsync(async (req, res) => {
    const fishinghole = await Fishinghole.findById(req.params.id);
    res.render('fishingholes/edit', { fishinghole });
}));



//EDIT and UPDATE
//this route submits the edit/update form 
app.put('/fishingholes/:id', validateFishinghole, catchAsync(async (req, res) => {
    const { id } = req.params;
    const fishinghole = await Fishinghole.findByIdAndUpdate(id, {...req.body.fishinghole});
    res.redirect(`/fishingholes/${fishinghole._id}`);
}));


//DELETE a fishing hole 
app.delete('/fishingholes/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Fishinghole.findByIdAndDelete(id);
    res.redirect('/fishingholes');
}));

//POST (submits the data from the review form)
app.post('/fishingholes/:id/reviews', validateReview, catchAsync(async (req, res) => {
    //use the id to find the fishinghole 
    const fishinghole = await Fishinghole.findById(req.params.id);
    //make a new review
    const review = new Review(req.body.review);
    //push onto fishinghole.reviews the new review
    fishinghole.reviews.push(review);
    //save
    await review.save();
    await fishinghole.save(); 
    //redirect back to the fishinghole show page
    res.redirect(`/fishingholes/${fishinghole._id}`);
}));


//DELETE route to delete a review for a fishinghole 
app.delete('/fishingholes/:id/reviews/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Fishinghole.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/fishingholes/${id}`);
}));


app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found!', 404));
});


//error handler
app.use((err, req, res, next) => {
    //the below is from the ExpressError class stuff
    const { statusCode = 500 } = err;
    if(!err.message) err.message = 'Oh no! Something went wrong! Maybe the fish stole your bait?!';
    res.status(statusCode).render('error', { err });
});

app.listen(3000, () => {
    console.log('Listening on port 3000!')
});