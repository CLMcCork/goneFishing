const express = require('express');
const path = require('path'); 
const mongoose = require('mongoose');
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


app.get('/', (req, res) => {
    res.render('home');
})

//Index Route
app.get('/fishingholes', async (req, res) => {
    const fishingholes = await Fishinghole.find({});
    res.render('fishingholes/index', { fishingholes });
})

//Show Route for a single fishing hole 



//making a hardcoded route to see if works --it does! Yay!!!
// app.get('/makefishinghole', async (req, res) => {
//     const hole = new Fishinghole({ title: 'M&D Farm', description: 'Biggest crappie I have ever seen!' });
//     await hole.save();
//     res.send(hole);
// })


app.listen(3000, () => {
    console.log('Listening on port 3000!')
})