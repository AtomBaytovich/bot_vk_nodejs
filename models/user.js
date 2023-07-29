const { Schema, model } = require("mongoose");

const schema = new Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
    },
    photos: [],
    age: {
        type: Number,
        required: true,
        min: 5,
        max: 100
    },
    gender: {
        type: String,
        required: true,
        enum: ['male', 'female']
    },
    // кого хочет искать
    interestingGender: {
        type: String,
        required: true,
        enum: ['male', 'female', 'all']
    },
    geo: {
        city: {
            type: String,
            required: true
        },
        coord: {
            lat: {
                type: String
            },
            lon: {
                type: String
            }
        }
    },
    desc: {
        type: String,
        max: 1000,
        default: ''
    },
    isSearch: {
        type: Boolean,
        default: true
    },
    listOfLikes: [{
        id: {
            type: Number,
            required: true
        },
        type: {
            type: String,
            required: true,
            enum: ['like', 'dislike']
        }
    }]
})

const User = model('User', schema);

module.exports = User;