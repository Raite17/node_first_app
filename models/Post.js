const mongoose = require('mongoose');
const urlSlugs = require('mongoose-url-slugs');
const transliter = require('transliter');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    img: {
        type: String,
        required: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'Users'
    }
}, {
    timestamps: true
});

postSchema.plugin(
    urlSlugs('title', {
        field: 'url',
        generator: text => transliter.slugify(text)
    })
);
postSchema.set('toJSON', {
    virtuals: true
});


module.exports = mongoose.model('Posts', postSchema);