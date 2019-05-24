const express = require('express');
const router = express.Router();
const User = require('../models/Users');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { ensureAuthenticated } = require('../config/auth');

router.get('/login', (req, res) => res.render('login'));
router.get('/register', (req, res) => res.render('register'));


router.get('/dashboard', ensureAuthenticated, (req, res) =>
    res.render('dashboard', {
        username: req.user.username
    })
);

//Обработчик регистрации

router.post('/register', (req, res) => {
    console.log(req.body);
    const { username, email, password, password_confirm } = req.body;
    let errors = [];

    //Проверка на заполнение полей
    if (!username || !email || !password || !password_confirm) {
        errors.push({ msg: 'Пожалуйста заполните все поля!' });
    }

    if (username.length < 5 || username.length > 16) {
        errors.push({ msg: 'Имя пользователя должно состоять от 5 до 16 символов !' });
    }

    //Проверяем пароли на совпадение
    if (password !== password_confirm) {
        errors.push({ msg: "Пароли не совпадают!" });
    }

    //Проверяем длину пароля
    if (password.length < 8) {
        errors.push({ msg: "Пароль должен состоять минимум из 8 символов" });
    }

    //Проверяем на символы
    if (!/^[a-zA-Z0-9]+$/.test(username)) {
        errors.push({ msg: "Только латинские буквы и цифры!" });
    }

    if (errors.length > 0) {
        res.render('register', {
            errors,
            username,
            email,
            password,
            password_confirm
        });
    } else {
        //Если валидация пройдена успешна
        User.findOne({ email: email })
            .then(user => {
                //Если пользователь уже существует
                errors.push({ msg: "Введенный вами Email уже занят,введите другой!" });
                if (user) {
                    res.render('register', {
                        errors,
                        username,
                        email,
                        password,
                        password_confirm
                    });
                } else {
                    const newUser = new User({
                        username,
                        email,
                        password
                    });
                    //Шифруем пароль
                    bcrypt.genSalt(10,
                        (err, salt) => bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err;
                            newUser.password = hash;
                            //Сохраняем пол-я в Mongo
                            newUser.save()
                                .then(user => {
                                    req.flash('success_msg', 'Регистрация прошла успешно,для завершения регистрации вам необходимо авторизоваться!');
                                    res.redirect('/login')
                                })
                                .catch(err => console.log(err));
                        }));
                }
            });
    }
});

router.post('/login', (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        req.flash('error_msg', 'Пожалуйста заполните все поля!');
    }
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/login',
        failureFlash: false
    })(req, res, next);
});

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
});

module.exports = router;