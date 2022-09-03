const User = require("../models/user");

class UserController {

    create({ name }) {
        console.log(name)
    }

    async get({ id }) {
        await User.findOne({ id }).lean();
    }

}

module.exports = new UserController();