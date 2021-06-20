const express = require('express');
const path = require('path'); 
const mongoose = require('mongoose');
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

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); 

//this parses request.body so can see what user types in form 
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));


app.get('/', (req, res) => {
    res.render('home');
});

//INDEX Route
app.get('/fishingholes', async (req, res) => {
    const fishingholes = await Fishinghole.find({});
    res.render('fishingholes/index', { fishingholes });
});

//make a NEW form and serve it 
app.get('/fishingholes/new', (req, res) => {
    res.render('fishingholes/new');
});

//CREATE--this is where the form is submitted to 
app.post('/fishingholes', async (req, res) => {
    const fishinghole = new Fishinghole(req.body.fishinghole);
    await fishinghole.save();
    res.redirect(`/fishingholes/${fishinghole._id}`);
});

//SHOW (details) Route for a single fishing hole 
app.get('/fishingholes/:id', async (req, res) => {
    const fishinghole = await Fishinghole.findById(req.params.id);
    res.render('fishingholes/show', { fishinghole });
});


//EDIT and UPDATE
//this route serves the edit/update form 
app.get('/fishingholes/:id/edit', async (req, res) => {
    const fishinghole = await Fishinghole.findById(req.params.id);
    res.render('fishingholes/edit', { fishinghole });
});



//EDIT and UPDATE
//this route submits the edit/update form 
app.put('/fishingholes/:id', async (req, res) => {
    const { id } = req.params;
    const fishinghole = await Fishinghole.findByIdAndUpdate(id, {...req.body.fishinghole});
    res.redirect(`/fishingholes/${fishinghole._id}`);
});


//making a hardcoded route to see if works --it does! Yay!!!
// app.get('/makefishinghole', async (req, res) => {
//     const hole = new Fishinghole({ title: 'M&D Farm', description: 'Biggest crappie I have ever seen!' });
//     await hole.save();
//     res.send(hole);
// })


app.listen(3000, () => {
    console.log('Listening on port 3000!')
});