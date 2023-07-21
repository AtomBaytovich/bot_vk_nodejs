const { _VK } = require("../instance");
const User = require("../models/user");
const { menuKeyboard, backScoreKeyboard, myTmpKeyboard, oneOrTwoKeyboard } = require("../utils/buttons");


// доделать профиль и его редактирование

const menuCommands = {
    // смотреть анкеты
    seeTmp: async function (context) {
        console.log(context)
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
    myTmp: async function (context) {
        const user = context.user;
        const attachment = await _VK.upload.messagePhoto({
            source: {
                value: user.photos[0]
            }
        });
        await context.send({
            message: `Вот твоя анкета: \n\n${user.name}, ${user.age}, ${user.geo.city}\n${user.desc}`,
            attachment,
            keyboard: myTmpKeyboard
        });
        return context.send(`
1. Заполнить анкету заново.
2. Изменить фото.
3. Изменить текст анкеты.
4. ✈ Наш бот знакомств в Telegram.
***
5. Вернуться к оценкам.`)
    },
    noSeeTmp: async function (context) {
        return context.scene.enter('offSeeTmpScene');
    },
    seeTG: function (context) {
        return context.send('Мой ТГ канал по разработке. Авторский интересный контент. \n\nhttps://t.me/atom_baytovich', {
            keyboard: backScoreKeyboard
        })
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