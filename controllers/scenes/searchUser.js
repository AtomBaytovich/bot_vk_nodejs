const { menuSearchUserKeyboard, menuKeyboard } = require("../../utils/buttons");
const userManagers = require("../userManagers");

const step = async (context) => {
    console.log('Вызов шага');
    if (context.scene.step.firstTime || !context.text) {
        const {
            age,
            interestingGender,
            city
        } = await userManagers.get({ id: context.senderId });
        const user = await userManagers.getRandomUser({
            years: age,
            gender: interestingGender,
            city
        });
        return context.send(`${user.name}, ${user.age}, ${user.city}`, {
            keyboard: menuSearchUserKeyboard
        });
    }

    if (!context.messagePayload?.command) return context.send('Нет такого варианта ответа');

    if (context.messagePayload.command == 'like') {
        // лайкаем , говорим тому юзеру и продолжаем  новый подбор

    }

    if (context.messagePayload.command == 'unlike') {
        // пропускаем и продолжаем подбор

    }


    if (context.messagePayload.command == 'sleep') {
        await context.scene.leave();
        return context.send(`
Подождем пока кто-то увидит твою анкету

1. Смотреть анкеты.
2. Моя анкета.
3. Я больше не хочу никого искать.
***
4. ✈ Мой канал в Telegram.
        `, {
            keyboard: menuKeyboard
        })
    }


    await context.scene.leave();
    return context.scene.enter('searchUser');
}


const searchUserScene = [step];

module.exports = searchUserScene;