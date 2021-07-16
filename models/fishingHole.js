const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;


const ImageSchema = new Schema({
        url: String,
        filename: String
});


ImageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload', '/upload/w_200');
});


const opts = { toJSON: { virtuals: true } };

//schema 
const FishingholeSchema = new Schema({
    title: String,
    images: [ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
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
}, opts);


FishingholeSchema.virtual('properties.popUpMarkup').get(function() {
    return `<strong><a href="/fishingholes/${this._id}">${this.title}</a><strong>
    <p>${this.description.substring(0, 20)}...</p>`
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