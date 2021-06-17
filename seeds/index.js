const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers.js');
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

//pass in an array and return random elements from that array 
const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    //clear everything in DB 
    await Fishinghole.deleteMany({});
    //loop through 50xs to get a random city/state
    for(let i = 0; i < 50; i++){
        const random1000 = Math.floor(Math.random() * 1000);
        const hole = new Fishinghole({
            //set new fishing hole to random city/state
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
             //give a random decriptor and place for title 
            title: `${sample(descriptors)} ${sample(places)}`
        })
        //save 
        await hole.save(); 
    }
}

seedDB(); 

//close database connection 
seedDB().then(() => {
    mongoose.connection.close(); 
})
