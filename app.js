const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const expressLayouts = require('express-ejs-layouts');
const flash = require('connect-flash');
const routes = require('./routes');
const mongoose = require('mongoose');
const config = require('./config');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');
const app = express();
const passportConfig = require('./config/passport')(passport);

mongoose.promise = global.Promise;

//middleware
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));


//Подключение к Mongo
mongoose.connection
    .on("error", error => console.log(error))
    .on("close", () => console.log("Database connection closed."))
    .once("open", () => {
        const info = mongoose.connections[0];
        console.log(`Connected to ${info.host}:${info.port}/${info.name}`);
    });

mongoose.connect(config.MONGO_URL);

//Express Сессии
app.use(
    session({
        secret: config.SESSION_SECRET,
        resave: true,
        saveUninitialized: true,
        store: new MongoStore({
            mongooseConnection: mongoose.connection
        })
    })
);

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

//routes
app.use(routes.auth);

//Запуск сервера
app.listen(config.PORT, () => {
    console.log(`Сервер запущен по порту ${config.PORT}`);
});