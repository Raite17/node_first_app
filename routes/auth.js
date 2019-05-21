const express = require('express');
const router = express.Router();

router.get('/login', (req, res) => res.render('login'));
router.get('/register', (req, res) => res.render('register'));

//Обработчик регистрации

router.post('/register', (req, res) => {
    console.log(req.body);
    const { username, email, password, password_confirm } = req.body;
    let errors = [];

    //Проверка на заполнение полей
    if (!username || !email || !password || !password_confirm) {
        errors.push({ message: 'Пожалуйста заполните все поля!' });
    }

    if (username.length < 5 || username.length > 16) {
        errors.push({ message: 'Имя пользователя должно состоять от 5 до 16 символов !' });
    }

    //Проверяем пароли на совпадение
    if (password !== password_confirm) {
        errors.push({ message: "Пароли не совпадают!" });
    }

    //Проверяем длину пароля
    if (password.length < 8) {
        errors.push({ message: "Пароль должен состоять минимум из 8 символов" });
    }

    //Проверяем на символы
    if (!/^[a-zA-Z0-9]+$/.test(username)) {
        errors.push({ message: "Только латинские буквы и цифры!" });
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
        res.send('Great success!');
    }
});

module.exports = router;