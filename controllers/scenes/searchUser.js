const { menuSearchUserKeyboard, menuKeyboard } = require("../../utils/buttons");
const { menuText } = require("../../utils/text");
const userManagers = require("../userManagers");

const step = async (context) => {

    if (context.scene.step.firstTime || !context.text) {

        const user = await userManagers.get({ id: context.peerId });
        if (!user) return;
        const {
            age,
            interestingGender,
            city
        } = user;

        const userFindRandom = await userManagers.getRandomUser({
            years: age,
            gender: interestingGender,
            city
        });

        context.scene.state.userFind = {
            age: userFindRandom.years,
            gender: userFindRandom.gender,
            geo: userFindRandom.geo
        };

        return context.send(`${userFindRandom.name}, ${userFindRandom.age}, ${userFindRandom.city}`, {
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

    if (context.messagePayload.command == 'message') {
        // пропускаем и продолжаем подбор

    }


    if (context.messagePayload.command == 'sleep') {
        await context.scene.leave();
        return context.send(`
Подождем пока кто-то увидит твою анкету

${menuText}
        `, {
            keyboard: menuKeyboard
        })
    }


    await context.scene.leave();
    return context.scene.enter('searchUser');
}


const searchUserScene = [step];

module.exports = searchUserScene;