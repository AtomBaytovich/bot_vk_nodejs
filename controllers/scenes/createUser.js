const { _API_VK, _VK } = require("../../instance");
const {
    genderKeyboard,
    interestingGenderKeyboard,
    locationKeyboard,
    noTextKeyboard,
    noKeyboard,
    myPhotoKeyboard,
    confirmFormKeyboard
} = require("../../utils/buttons");

const userManagers = require("../userManagers");

const stepOne = (context) => {
    if (context.scene.step.firstTime || !context.text) {
        return context.send(`Сколько тебе лет?`, {
            keyboard: noKeyboard
        })
    }
    const text = context.text;
    if (!Number(text) || text < 5 || text > 100) return context.reply('Недопустимый возраст! От 5 и до 100 лет!');

    context.scene.state.age = context.text;
    return context.scene.step.next();
}

const stepTwo = (context) => {
    if (context.scene.step.firstTime || !context.text) {
        return context.send('Теперь определимся с полом :)', {
            keyboard: genderKeyboard
        });
    }
    if (!context.messagePayload) return context.reply('Используй клавиатуру бота');
    context.scene.state.gender = context.messagePayload.type;
    return context.scene.step.next();
}

const stepThree = (context) => {
    if (context.scene.step.firstTime || !context.text) {
        return context.send('Кто тебе интересен?', {
            keyboard: interestingGenderKeyboard
        });
    }
    if (!context.messagePayload) return context.reply('Используй клавиатуру бота');
    context.scene.state.interestingGender = context.messagePayload.type;
    return context.scene.step.next();
}

const stepFour = (context) => {
    if (context.scene.step.firstTime) {
        return context.send('Из какого ты города?', {
            keyboard: locationKeyboard
        });
    }
    if (!context.geo) return context.reply('Используй клавиатуру бота! Мне важно знать в каком ты городе живёшь!');
    context.scene.state.city = context.geo.place.city;
    return context.scene.step.next();
}

const stepFive = (context) => {
    if (context.scene.step.firstTime || !context.text) {
        return context.send('Как мне тебя называть?', {
            keyboard: noKeyboard
        });
    }
    context.scene.state.name = context.text;
    return context.scene.step.next();
}

const stepSix = (context) => {
    if (context.scene.step.firstTime || !context.text) {
        return context.send('Расскажи о себе и кого хочешь найти, чем предлагаешь заняться. Это поможет лучше подобрать тебе компанию.', {
            keyboard: noTextKeyboard
        });
    }
    if (context.messagePayload) {
        context.scene.state.desc = '';
        return context.scene.step.next();
    }
    const text = context.text;
    if (text.length > 1000) return context.reply('Что-то слишком большой текст... Давай до 1000 символов. Хорошо?')
    context.scene.state.desc = text;
    return context.scene.step.next();
}

const stepSeven = async (context) => {
    try {
        if (context.scene.step.firstTime) {
            return context.send('Теперь пришли свое фото, его будут видеть другие пользователи', {
                keyboard: myPhotoKeyboard
            });
        }
        if (!context.messagePayload && context.attachments.length < 1) return context.reply('Пришли мне своё фото!')
        if (context.messagePayload) {
            const userVk = await _API_VK.users.get({
                user_ids: context.senderId,
                fields: ['photo_max_orig']
            })
            context.scene.state.photos = [userVk[0].photo_max_orig];
        } else {
            context.scene.state.photos = [context.attachments[0].largeSizeUrl]
        }
        return context.scene.step.next();
    } catch (error) {
        console.log(error)
        context.reply('Ой.. Я сломался... Произошла какая - то ошибка!')
    }
}


const stepFinish = async (context) => {
    try {
        if (context.scene.step.firstTime || !context.text) {
            console.log(context.scene.state)

            const {
                age,
                city,
                name,
                desc,
                photos
            } = context.scene.state;
            // переделать отправку сообщение о подтвреждении записи
            const attachment = await _VK.upload.messagePhoto({
                source: {
                    value: photos[0]
                }
            });

            await context.send({
                message: `Вот твоя анкета: \n\n${name}, ${age}, ${city}\n${desc}`,
                attachment
            });
            return context.send('Всё верно?', {
                keyboard: confirmFormKeyboard
            })
        }

        return context.scene.step.next();
    } catch (error) {
        console.log(error)
        context.reply('Ой.. Я сломался... Произошла какая - то ошибка!')
    }
}

const stepEnd = async (context) => {
    try {
        if (!context.messagePayload) {
            return context.reply('Используй клавиатуру!')
        }

        if (context.messagePayload.command == 'yes') {
            const {
                age,
                gender,
                interestingGender,
                city,
                name,
                desc,
                photos
            } = context.scene.state;

            await userManagers.create({
                id: context.peerId,
                age,
                gender,
                interestingGender,
                city,
                name,
                desc,
                photos
            })
            await context.send('Добро пожаловать!')
            await context.scene.leave();
            return context.scene.enter('searchUser');
        }

        await context.scene.leave()
        return context.scene.enter('signup');

    } catch (error) {
        console.log(error)
        context.reply('Ой.. Я сломался... Произошла какая - то ошибка!')
    }
}

const createUserScene = [stepOne, stepTwo, stepThree, stepFour, stepFive, stepSix, stepSeven, stepFinish, stepEnd]

module.exports = createUserScene;