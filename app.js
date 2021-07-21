if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config(); 
}

const express = require('express');
const path = require('path'); 
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utilities/ExpressError');
const methodOverride = require('method-override');
const passport = require('passport');
const localStrategy = require('passport-local'); 
const User = require('./models/user');
const helmet = require('helmet');

const mongoSanitize = require('express-mongo-sanitize');

const MongoStore = require('connect-mongo');


const userRoutes = require('./routes/users');
const fishingholeRoutes = require('./routes/fishingholes');
const reviewRoutes = require('./routes/reviews');
//const dbUrl = process.env.DB_URL;

const dbUrl = 'mongodb://localhost:27017/fishing-hole';

//mongoose.connect('mongodb://localhost:27017/fishing-hole', {
//mongoose.connect(dbUrl, {
mongoose.connect( dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => {
    console.log('Database connected!');
});

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); 


//this parses request.body so can see what user types in form 
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize());

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: 'thiswillbeasecrethereeventually!'
    }
});

store.on('error', function (e) {
    console.log("Session Store Error", e)
});

const sessionConfig = {
    store,
    name: 'session',
    secret: 'thiswillbeasecrethereeventually',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        //when deploy this will want this here-- secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, //millisec, sec, min, hrs, days
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

//this app.use session must come before app.use passport session (per the passport docs)
app.use(session(sessionConfig));
app.use(flash());
app.use(helmet());

//CSP (Content Security Policy stuff)
//this restricts where can get scripts from 
const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://cdn.jsdelivr.net",
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dvtbkorbp/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);



//passport stuff 
app.use(passport.initialize()); 
app.use(passport.session());
//telling passport to use localStrategy that is required
//and for localStrategy to use authentication method on user model --automatic static method from passport 
passport.use(new localStrategy(User.authenticate()));
//telling passport how to serialize data (store it)
passport.serializeUser(User.serializeUser());
//telling passport how to deserialize data (unstore it)
passport.deserializeUser(User.deserializeUser());


//middleware for flash--runs on every single request
app.use((req, res, next) => {
    //console.log(req.session);
    res.locals.currentUser = req.user; //will have access to currentUser in ALL templates w/ this 
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});



//app.use path and router name
app.use('/', userRoutes);
app.use('/fishingholes', fishingholeRoutes);
app.use('/fishingholes/:id/reviews', reviewRoutes);



//home
app.get('/', (req, res) => {
    res.render('home');
});



app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found!', 404));
});


//error handler
app.use((err, req, res, next) => {
    //the below is from the ExpressError class stuff
    const { statusCode = 500 } = err;
    if(!err.message) err.message = 'Oh no! Something went wrong! Maybe the fish stole your bait?!';
    res.status(statusCode).render('error', { err });
});

app.listen(3000, () => {
    console.log('Listening on port 3000!')
});