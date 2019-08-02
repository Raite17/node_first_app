const express = require('express');
const router = express.Router();
const path = require('path');
const Post = require('../models/Post');
const multer = require('multer');
const config = require('../config');
const mkdirp = require('mkdirp');
const Sharp = require('sharp');
const moment = require('moment');
const diskStorage = require('../utils/diskStorage');
const { ensureAuthenticated } = require('../config/auth');

const randomString = () => Math.random().toString(36).slice(-3);

//fileUpload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = '/' + randomString() + '/' + randomString();
        req.dir = dir;
        mkdirp(config.DESTINATION + dir, err => cb(err, config.DESTINATION + dir));
    },
    filename: (req, file, cb) => {
        const filename = Date.now().toString(36) + path.extname(file.originalname);
        const dir = req.dir;
        cb(null, filename);
    },
    sharp: (req, file, cb) => {
        const resizer =
            Sharp()
            .resize(1024, 768)
            .max()
            .withoutEnlargement()
            .toFormat('jpg')
            .jpeg({
                quality: 40,
                progressive: true
            });
        cb(null, resizer);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
            const err = new Error('Extension');
            err.code = "EXTENSION";
            return cb(err);
        }
        cb(null, true);
    }
});

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

router.get('/posts/:post', (req, res, next) => {
    const url = req.params.post.trim().replace(/ +(?= )/g, '');
    if (!url) {
        const err = new Error('Not Found');
        err.status = 404;
        next(err);
    } else {
        Post.findOne({
            url
        }).then(post => {
            if (!post) {
                const err = new Error('Not Found');
                err.status = 404;
                next(err);
            } else {
                const createdAt = moment(post.createdAt).format('DD-MM-YYYY hh:mm');
                res.render('posts/post', {
                    post,
                    createdAt
                });
            }
        });
    }
});

router.post('/create-post', upload.single('file'), (req, res) => {
    const { _id, title, description } = req.body;
    const userId = req.user._id;
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
            img: req.file.path,
            createdBy: userId
        });
        if (_id) {
            Post.findOneAndUpdate({
                    _id,
                    createdBy: userId
                }, {
                    title,
                    description,
                    createdBy: userId
                }, { new: true })
                .then(post => {
                    res.json({
                        status: true,
                        message: "Запись успешно редактирована!",
                        post
                    })
                })
                .catch(err => console.log(err));
        } else {
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
module.exports = router