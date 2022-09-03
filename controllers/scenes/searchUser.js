const { menuSearchUserKeyboard } = require("../../utils/buttons");
const userManagers = require("../userManagers");
const { getRandomUser } = require("../userManagers");

const step = async (context) => {
    console.log('Вызов шага')
    if (context.scene.step.firstTime || !context.text) {
        const {
            age,
            interestingGender,
            city
        } = await userManagers.get({ id: context.senderId });
        const user = await getRandomUser({
            years: age,
            gender: interestingGender,
            city
        })
        return context.send(`${user.name}, ${user.age}, ${user.city}`, {
            keyboard: menuSearchUserKeyboard
        })
    }

    if (!context.messagePayload) return context.send('Нет такого варианта ответа');

    if (context.messagePayload.command == 'like') {
        // лайкаем , говорим тому юзеру и продолжаем  новый подбор

    }
    
    if(context.messagePayload.command == 'unlike') {
        // пропускаем и продолжаем подбор
    }


    
    await context.scene.leave()
    return context.scene.enter('searchUser');
}


const searchUserScene = [step]

module.exports = searchUserScene;