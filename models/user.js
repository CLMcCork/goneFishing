const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

//define User schema 
const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});

//this allows you to add onto User schema a password, username field, make sure they are unique, and additional methods
UserSchema.plugin(passportLocalMongoose); 

//compile the model and export
module.exports = mongoose.model('User', UserSchema);