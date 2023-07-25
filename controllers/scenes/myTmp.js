const { myTmpKeyboard, backScoreKeyboard, backKeyboard, myTmpPhoto } = require("../../utils/buttons");
const User = require("../../models/user");
const { _VK, _API_VK } = require("../../instance");
const { tgChannelText, keyboardText } = require("../../utils/text");
const userManagers = require("../userManagers");


const stepMain = async (context) => {
    try {
        const text = context.text;
        if (context.scene.step.firstTime || !text) {
            const user = await userManagers.get({ id: context.peerId });

            await context.send({
                message: `Вот твоя анкета: \n\n${user.name}, ${user.age}, ${user.geo.city}\n${user.desc}`,
                attachment: user.photos[0],
                keyboard: myTmpKeyboard
            });
            return context.send(`
1. Заполнить анкету заново.
2. Изменить фото.
3. Изменить текст анкеты.
4. ✈ Наш бот знакомств в Telegram.
***
5. Вернуться к оценкам.`)
        }

        if (!context.messagePayload?.command) return context.send(keyboardText);

        if (context.messagePayload.command == '1') {
            // Заполнить анкету заново
            await context.scene.leave();
            return context.scene.enter('signup');
        }

        if (context.messagePayload.command == '2') {
            // Изменить фото
            return await context.scene.step.go(1)
        }

        if (context.messagePayload.command == '3') {
            // Изменить текст анкеты
            return await context.scene.step.go(2)
        }

        if (context.messagePayload.command == '4') {
            // ✈ Наш бот знакомств в Telegram
            return context.send(tgChannelText)
        }

        if (context.messagePayload.command == '5') {
            // оценки вернуться
            await context.scene.leave();
            return context.scene.enter('searchUser');
        }

    } catch (error) {
        console.error(error)
        return context.send('Ой... я сломался')
    }

}

// фото
const stepTwo = async (context) => {
    const text = context.text;
    try {
        if (context.scene.step.firstTime || (!text && context.attachments.length < 1)) {
            return context.send(`Ты можешь загрузить сюда своё фото или нажми на кнопку и будет фото из аватарки Вк
            
            2. Вернуться в основное меню.`, {
                keyboard: myTmpPhoto
            })
        }
        if (context.messagePayload?.command == 'back') return await context.scene.step.go(0);
        if (!context.messagePayload && context.attachments.length < 1) return context.reply('Пришли мне своё фото!')

        if (context.messagePayload?.command == 'my_photo') {
            const userVk = await _API_VK.users.get({
                user_ids: context.senderId,
                fields: 'photo_max_orig'
            })
            const attachment = await _VK.upload.messagePhoto({
                source: {
                    value: userVk[0].photo_max_orig
                }
            });
            context.scene.state.photos = [String(attachment)];
        } else {
            context.scene.state.photos = [String(context.attachments[0])]
        }

        await User.updateOne({ id: context.peerId }, {
            photos: context.scene.state.photos
        })
        return await context.scene.step.go(0)

    } catch (error) {
        console.error(error)
        return context.send('Ой... я сломался')
    }
}

// описание
const stepThree = async (context) => {
    try {
        const text = context.text;

        if (context.scene.step.firstTime || !text) {
            return context.send(`Расскажи о себе, кого хочешь найти, чем предлагаешь заняться

            1. Вернуться назад`, {
                keyboard: backKeyboard
            })
        }

        if (!text && !context.messagePayload?.command) return context.send(keyboardText);
        if (context.messagePayload?.command == 'back') return await context.scene.step.go(0)
        if (text.length > 1000) return context.reply('Что-то слишком большой текст... Давай до 1000 символов. Хорошо?')

        await User.updateOne({ id: context.peerId }, {
            desc: text
        })
        return await context.scene.step.go(0)
    } catch (error) {
        console.error(error)
        return context.send('Ой... я сломался')
    }
}

const myTmpScene = [stepMain, stepTwo, stepThree];

module.exports = myTmpScene;