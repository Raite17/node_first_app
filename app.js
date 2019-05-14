const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const mongoose = require('mongoose');
const errorHandler = require('errorhandler');
const config = require('./config');
const models = require('./models');
const passport = require('./config/passport');
const routes = require('./routes');

mongoose.promise = global.Promise;

//middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(errorHandler());
app.use(routes);

//Mongo connection
mongoose.connection
    .on("error", error => console.log(error))
    .on("close", () => console.log("Database connection closed."))
    .once("open", () => {
        const info = mongoose.connections[0];
        console.log(`Connected to ${info.host}:${info.port}/${info.name}`);
    });

mongoose.connect(config.MONGO_URL);

//Выдаем 404 ошибку если не найдена страница
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

//Обрабатываем все возникшие ошибки
app.use((err, req, res) => {
    res.status(err.status || 500);
    res.json({
        errors: {
            message: err.message,
            error: {},
        },
    });
});

//Server start
app.listen(config.PORT, () => {
    console.log(`Сервер запущен по порту ${config.PORT}`);
});