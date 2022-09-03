const User = require("../controllers/userManagers")

const checkUserBd = async (context) => {
    console.log(context)
    const user = await User.get({ id: context.senderId });
    if(!user) return context.scene.enter('signup');
    console.log(user)
}

module.exports = {
    checkUserBd
}