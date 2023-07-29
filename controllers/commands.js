const User = require("../models/user");
const { menuKeyboard, backScoreKeyboard } = require("../utils/buttons");
const { tgChannelText, menuText } = require("../utils/text");

const menuCommands = {
    // меню
    menu: function (context) {
        return context.send(menuText, {
            keyboard: menuKeyboard
        })
    },
    // смотреть анкеты
    seeTmp: async function (context) {
        if (context.user?.isSearch == false) {
            await context.send('Я помню тебя! Рад видеть снова!')
            await User.updateOne({
                id: context.peerId
            },
                {
                    isSearch: true
                })
        }
        return context.scene.enter('searchUser');
    },
    // моя анкета
    myTmp: function (context) {
        return context.scene.enter('myTmp');
    },
    noSeeTmp: function (context) {
        return context.scene.enter('offSeeTmp');
    },
    seeTG: function (context) {
        return context.send(tgChannelText, {
            keyboard: backScoreKeyboard
        })
    },
    seeLikesUser: function (context) {
        return context.scene.enter('likeListUsers');
    }
}

const noFoundCommand = async (context) => {
    return await context.reply('Ой... Нет такой команды', {
        keyboard: menuKeyboard
    })
}

module.exports = {
    menuCommands,
    noFoundCommand,
}