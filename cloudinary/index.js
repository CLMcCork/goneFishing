const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

//set config on cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

//instantiate an instance of cloudinary storage
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'goneFishing',
        allowedFormats: ['jpeg', 'png', 'jpg']
    }
 });
 
//export
module.exports = {
    cloudinary,
    storage
}
