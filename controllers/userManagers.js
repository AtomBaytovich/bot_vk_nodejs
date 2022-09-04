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

        await newUser.save(err => {
            if (err) console.log(err)
        });
        return newUser;
    }

    async get({ id }) {
        return await User.findOne({ id }).lean();
    }

    async getRandomUser({ years, city, gender }) {
        const user = await User.findOne({

        })
        
        return {
            name: 'Glorius',
            age: 17,
            city: 'Москва'
        }
        
    }

}

module.exports = new UserController();