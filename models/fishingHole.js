const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

//schema 
const FishingholeSchema = new Schema({
    title: String,
    image: String,
    price: Number, //or parking lot price? //fishing license? 
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});



//this is query mongoose middleware
FishingholeSchema.post('findOneAndDelete', async function(doc) {
    //console.log("Deleted!");
    //console.log(doc); shows you the fishinghole that was deleted 
    if(doc) { //if we did find a document (fishinghole)
        await Review.deleteMany({ //delete all reviews 
            _id: { //where their id field is 
                $in: doc.reviews //in the document that was just deleted in its reviews array
            }
        })
    }
});

//export model --model name = Fishinghole 
module.exports = mongoose.model('Fishinghole', FishingholeSchema);