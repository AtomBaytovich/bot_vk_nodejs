const User = require("../controllers/userManagers")

const checkUserBd = async (context, next) => {
    const user = await User.get({ id: context.senderId });
    if (!user) {
        context.send(`🥰 Привет! Я бот НеДамВинчик \n Меня создал в учебных целях https://t.me/atom_baytovich\n\n Вижу, что ты у нас впервые. Зарегистрируй свою анкету!`);
        context.send({
            sticker_id: 72805
        });
        return context.scene.enter('signup');
    }
    context.user = user;
    return next();
}

module.exports = {
    checkUserBd
}