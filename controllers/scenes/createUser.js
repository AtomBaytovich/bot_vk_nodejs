const { _API_VK, _VK } = require("../../instance");
const User = require("../../models/user");
const {
    genderKeyboard,
    interestingGenderKeyboard,
    locationKeyboard,
    noTextKeyboard,
    noKeyboard,
    myPhotoKeyboard,
    confirmFormKeyboard
} = require("../../utils/buttons");
const { keyboardText } = require("../../utils/text");

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
    if (!context.messagePayload) return context.reply(keyboardText);
    context.scene.state.gender = context.messagePayload.type;
    return context.scene.step.next();
}

const stepThree = (context) => {
    if (context.scene.step.firstTime || !context.text) {
        return context.send('Кто тебе интересен?', {
            keyboard: interestingGenderKeyboard
        });
    }
    if (!context.messagePayload) return context.reply(keyboardText);
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
    context.scene.state.geo = {
        city: context.geo.place.city,
        latitude: context.geo.coordinates.latitude,
        longitude: context.geo.coordinates.longitude
    };
    return context.scene.step.next();
}

const stepFive = (context) => {
    if (context.scene.step.firstTime || !context.text) {
        return context.send('Как мне тебя называть?', {
            keyboard: noKeyboard
        });
    }
    const text = context.text;
    if (text.length > 35) return context.reply('Что-то слишком большой текст... Давай до 35 символов. Хорошо?')
    context.scene.state.name = text;
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
            const attachment = await _VK.upload.messagePhoto({
                source: {
                    value: userVk[0].photo_max_orig
                }
            });
            context.scene.state.photos = [String(attachment)];
        } else {
            context.scene.state.photos = [String(context.attachments[0])]
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
                geo,
                name,
                desc,
                photos
            } = context.scene.state;
            // переделать отправку сообщение о подтвреждении записи

            await context.send({
                message: `Вот твоя анкета: \n\n${name}, ${age}, ${geo.city}\n${desc}`,
                attachment: photos[0]
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
                geo,
                name,
                desc,
                photos
            } = context.scene.state;

            const newUser = new User({
                id: context.peerId,
                age,
                gender,
                interestingGender,
                geo: {
                    city: geo.city,
                    coord: {
                        lat: geo.latitude,
                        lon: geo.longitude
                    }
                },
                name,
                desc,
                photos
            })

            await newUser.save(err => {
                if (err) console.log(err)
            });

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