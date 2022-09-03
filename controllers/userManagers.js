const User = require("../models/user");

class UserController {

    async create({
        id,
        age,
        gender,
        interestingGender,
        city,
        name,
        desc,
        photos
    }) {
        const newUser = new User({
            id,
            age,
            gender,
            interestingGender,
            city,
            name,
            desc,
            photos
        })
        console.log(newUser)
        await newUser.save(err => {
            if (err) console.log(err)
        });
        return newUser;
    }

    async get({ id }) {
        return await User.findOne({ id }).lean();
    }

    async getRandomUser({ years, city, gender }) {

        return {
            name: 'Glorius',
            age: 17,
            city: 'Москва'
        }
        
    }

}

module.exports = new UserController();