const express = require('express');
const path = require('path'); 
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const catchAsync = require('./utilities/catchAsync');
const ExpressError = require('./utilities/ExpressError');
const methodOverride = require('method-override');
const Fishinghole = require('./models/fishingHole');

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

//this parses request.body so can see what user types in form 
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));


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
app.post('/fishingholes', catchAsync(async (req, res, next) => {
    if(!req.body.fishinghole) throw new ExpressError('Invalid Fishing Hole Data', 400);
    const fishinghole = new Fishinghole(req.body.fishinghole);
    await fishinghole.save();
    res.redirect(`/fishingholes/${fishinghole._id}`);
}));

//SHOW (details) Route for a single fishing hole 
app.get('/fishingholes/:id', catchAsync(async (req, res) => {
    const fishinghole = await Fishinghole.findById(req.params.id);
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
app.put('/fishingholes/:id', catchAsync(async (req, res) => {
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