const { seeTmpKeyboard, oneOrTwoKeyboard, menuKeyboard } = require("../../utils/buttons");
const User = require("../../models/user");
const { menuText, keyboardText } = require("../../utils/text");

const step = async (context) => {
    try {
        const text = context.text;
        if (context.scene.step.firstTime || !text) {
            return context.send(`Так ты не узнаешь, что кому-то нравишься... Точно хочешь отключить свою анкету?

        1. Да, отключить анкету.
        2. Нет, вернуться назад.`, {
                keyboard: oneOrTwoKeyboard
            })
        }
        if (text == '1') {
            await User.updateOne({
                id: context.peerId
            },
                {
                    isSearch: false
                })
            context.send(`Надеюсь ты нашел кого-то благодаря мне! Рад был с тобой пообщаться, будет скучно – пиши, обязательно найдем тебе кого-нибудь`, {
                keyboard: seeTmpKeyboard
            })
        } else if (text == '2') {
            // вернуться назад
            context.send(menuText, {
                keyboard: menuKeyboard
            })
            return await context.scene.leave();
        } else return context.send(keyboardText)

        return await context.scene.leave();
    } catch (error) {
        console.error(error)
        return context.send('Ой... я сломался')
    }

}


const offSeeTmpScene = [step];

module.exports = offSeeTmpScene;