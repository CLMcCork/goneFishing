const mongoose = require('mongoose');
const cities = require('./cities');
const Fishinghole = require('../models/fishingHole');

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

//clear everything in DB 
const seedDB = async () => {
    await Fishinghole.deleteMany({});
    const c = new Fishinghole({title: 'Bellas Fishing Hole'});
    await c.save();
}

seedDB(); 
