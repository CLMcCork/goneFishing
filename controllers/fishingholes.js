const Fishinghole = require('../models/fishingHole');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken});
const { cloudinary } = require('../cloudinary');

module.exports.index = async (req, res) => {
    const fishingholes = await Fishinghole.find({});
    res.render('fishingholes/index', { fishingholes });
}

module.exports.renderNewForm = (req, res) => {
    res.render('fishingholes/new');
}

module.exports.createFishinghole = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.fishinghole.location,
        limit: 1
    }).send()
    const fishinghole = new Fishinghole(req.body.fishinghole);
    fishinghole.geometry = geoData.body.features[0].geometry;
    fishinghole.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    fishinghole.author = req.user._id;
    await fishinghole.save();
    console.log(fishinghole);
    req.flash('success', 'Thanks for adding your Fishing Hole info!')
    res.redirect(`/fishingholes/${fishinghole._id}`);
}

module.exports.showFishinghole = async (req, res) => {
    const fishinghole = await (Fishinghole.findById(req.params.id).populate({
        path:'reviews',
        populate: { 
            path: 'author'
        }
      }).populate('author'));
    //console.log(fishinghole);
    if(!fishinghole) {//if didn't find fishinghole w/ that id, flash this error and redirect
        req.flash('error', "Oh no! We cannot find that Fishing Hole!");
        return res.redirect('/fishingholes');
    }
    res.render('fishingholes/show', { fishinghole });
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const fishinghole = await Fishinghole.findById(id);
    if(!fishinghole) {
        req.flash('error', "Oh no! We cannot find that Fishing Hole!");
        return res.redirect('/fishingholes');
    }
    res.render('fishingholes/edit', { fishinghole });
}

module.exports.updateFishinghole = async (req, res) => {
    const { id } = req.params;
    //console.log(req.body);
    const fishinghole = await Fishinghole.findByIdAndUpdate(id, {...req.body.fishinghole});
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    fishinghole.images.push(...imgs);
    //below updates the geolocation (so if changed location the map shows new location)
    const geoData = await geocoder.forwardGeocode({
        query: req.body.fishinghole.location,
        limit: 1
    }).send()
    fishinghole.geometry = geoData.body.features[0].geometry;
    await fishinghole.save();
    if(req.body.deleteImages) {
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await fishinghole.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages }}}});
    }
    req.flash('success', 'Successfully updated Fishing Hole!');
    res.redirect(`/fishingholes/${fishinghole._id}`);
}

module.exports.deleteFishinghole = async (req, res) => {
    const { id } = req.params;
    await Fishinghole.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted a Fishing Hole!');
    res.redirect('/fishingholes');
}