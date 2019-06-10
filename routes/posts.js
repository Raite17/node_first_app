const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const { ensureAuthenticated } = require('../config/auth');

//routes
router.get('/posts', ensureAuthenticated, (req, res) => {
    Post.find({}).sort({ createdAt: -1 })
        .then((posts) => {
            res.render('posts/index', { posts })
        })
        .catch(err => {
            throw new Error(err);
        });
});

router.post('/create-post', (req, res) => {
    const { title, description } = req.body;
    title.trim().replace(/ +(?= )/g, '');
    description.trim();
    let errors = [];

    if (title.length < 6 || title.length > 64) {
        errors.push({
            status: 'Validate Failure',
            message: "Заголовок должен состоять от 5 до 64 символов"
        });
    }

    if (description.length < 5) {
        errors.push({
            status: 'Validate Failure',
            message: "Описание должно состоять не менее из 5 символов"
        });
    }

    if (errors.length > 0) {
        res.send(errors);
    } else {
        const newPost = new Post({
            title,
            description,
            createdBy: req.user._id
        });
        newPost.save()
            .then(post => {
                res.json({
                    status: true,
                    message: "Запись успешно добавлена!",
                    post
                });
            })
            .catch(err => {
                res.json({
                    status: false,
                    message: "Произошла ошибка,попробуйте снова!"
                });
            });
    }
});

router.delete('/delete-post/:id', (req, res) => {
    const _id = req.params.id;
    Post.findByIdAndDelete({ _id }).
    then(post => {
        res.json({
                status: true,
                message: "Запись успешно удалена!"
            })
            .catch(err => console.log(err));
    });
});
module.exports = router;