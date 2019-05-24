const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/Users');

module.exports = (passport) => {
    passport.use(
        new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
            //Находим пользователя
            User.findOne({
                email: email
            }).then(user => {
                if (!user) {
                    return done(null, false, { message: 'Пользователь не найден!' });
                }
                //Проверка паролей
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) throw err;
                    if (isMatch) {
                        return done(null, user);
                    } else {
                        return done(null, false, { message: "Неверный пароль!" });
                    }
                })
            }).catch(err => console.log(err));
        })
    );

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });
}