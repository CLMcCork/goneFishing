const Joi = require('joi');

//this is NOT mongoose schema--this is just a pattern for a javascript 
//object that has has been defined in our schema.js file using JOI methods
module.exports.fishingholeSchema = Joi.object({
    fishinghole: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required().min(0),
        //image: Joi.string().required(),
        location: Joi.string().required(),
        description: Joi.string().required()
    }).required(),
    deleteImages: Joi.array()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required()
    }).required()
});