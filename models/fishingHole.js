const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//schema 
const FishingholeSchema = new Schema({
    title: String,
    image: String,
    price: Number, //or parking lot price? //fishing license? 
    description: String,
    location: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

//export model --model name = Fishinghole 
module.exports = mongoose.model('Fishinghole', FishingholeSchema);