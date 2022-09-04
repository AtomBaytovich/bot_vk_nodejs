const { _VK } = require("../instance");
const { menuKeyboard, backScoreKeyboard, myTmpKeyboard } = require("../utils/buttons");


// доделать профиль и его редактирование

const menuCommands = {
    // смотреть анкеты
    seeTmp: async function (context) {
        console.log(context)
        return context.scene.enter('searchUser');
    },
    myTmp: async function (context) {
        const user = context.user;
        const attachment = await _VK.upload.messagePhoto({
            source: {
                value: user.photos[0]
            }
        });
        await context.send({
            message: `Вот твоя анкета: \n\n${user.name}, ${user.age}, ${user.city}\n${user.desc}`,
            attachment,
            keyboard: myTmpKeyboard
        });
        return context.send(`
1. Заполнить анкету заново.
2. Изменить фото.
3. Изменить текст анкеты.
4. ✈ Наш бот знакомств в Telegram.
***
5. Смотреть анкеты.`)
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
    noFoundCommand
}