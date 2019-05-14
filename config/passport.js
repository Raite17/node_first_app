const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const Users = mongoose.model('Users');

passport.use(new LocalStrategy({
    loginField: 'user[login]',
    emailField: 'user[email]',
    passwordField: 'user[password]',
}, (login, email, password, done) => {
    Users.findOne({ login })
        .then((user) => {
            if (!user || !user.validatePassword(password)) {
                return done(null, false, { errors: { 'email or password': 'is invalid' } });
            }
            return done(null, user);
        }).catch(done);
}));