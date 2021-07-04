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


const userRoutes = require('./routes/users');
const fishingholeRoutes = require('./routes/fishingholes');
const reviewRoutes = require('./routes/reviews');



mongoose.connect('mongodb://localhost:27017/fishing-hole', {
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

const sessionConfig = {
    secret: 'thiswillbeasecrethereeventually',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, //millisec, sec, min, hrs, days
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

//this app.use session must come before app.use passport session (per the passport docs)
app.use(session(sessionConfig));
app.use(flash());


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
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});



//app.use path and router name
app.use('/', userRoutes);
app.use('/fishingholes', fishingholeRoutes);
app.use('/fishingholes/:id/reviews', reviewRoutes);



//home
// app.get('/', (req, res) => {
//     res.render('home');
// });



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