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
        const price = Math.floor(Math.random() * 20) + 10; 
        const hole = new Fishinghole({
            author: '60e6176c6f3c6de32632101d',
            //set new fishing hole to random city/state
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
             //give a random decriptor and place for title 
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Bacon ipsum dolor amet leberkas brisket picanha porchetta andouille chicken alcatra flank pig cow.  Chicken porchetta swine capicola meatloaf salami pork loin kielbasa, pork chop picanha alcatra beef ball tip tongue hamburger.  Short ribs spare ribs jerky, landjaeger leberkas beef chicken swine meatloaf prosciutto sirloin brisket.',
            price,
            images: [
                {
                  url: 'https://res.cloudinary.com/dvtbkorbp/image/upload/v1625942084/goneFishing/qgmnacv2jc9slxylq5rk.jpg',
                  filename: 'goneFishing/qgmnacv2jc9slxylq5rk'
                },
                {
                  url: 'https://res.cloudinary.com/dvtbkorbp/image/upload/v1625942085/goneFishing/lhcxxcss4uijiydujnad.jpg',
                  filename: 'goneFishing/lhcxxcss4uijiydujnad'
                }
              ]
        })
        //save 
        await hole.save(); 
    }
}

//seedDB(); 

//close database connection 
seedDB().then(() => {
    mongoose.connection.close(); 
})
