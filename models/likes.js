const { Schema, model } = require("mongoose");

const schema = new Schema({
    // кто лайкнул
    whoLiked: {
        type: Number,
        required: true
    },
    // кого лайкнули
    whoLikedIt: {
        type: Number,
        required: true
    },
    // сообщение юзеру от whoLiked
    message: {
        type: String
    },
    // дата создания лайка
    date: {
        type: Date,
        default: new Date()
    }
})


const Likes = model('Likes', schema);

module.exports = Likes;