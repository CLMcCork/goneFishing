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
const fishingholes = require('./routes/fishingholes');


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


//app.use path and router name
app.use('/fishingholes', fishingholes);


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