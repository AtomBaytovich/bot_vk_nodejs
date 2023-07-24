const { _VK } = require("../../instance");
const { menuSearchUserKeyboard, menuKeyboard, backTmpKeyboard } = require("../../utils/buttons");
const { menuText } = require("../../utils/text");
const userManagers = require("../userManagers");
const haversine = require('haversine-distance')

const stepMain = async (context) => {

    if (context.scene.step.firstTime || !context.text) {

        const user = await userManagers.get({ id: context.peerId });
        if (!user) return;
        const {
            id,
            age,
            interestingGender,
            geo
        } = user;

        const userFindRandom = await userManagers.getRandomUser({
            myId: id,
            age,
            gender: interestingGender,
            city: geo.city
        });
        /// защита на законченность 
        if (!userFindRandom) {
            await context.scene.leave();
            return context.send(`Упс... Кажется все анкеты в по твоим параметрам закончились! 
            Подожди пока появятся новые или ты можешь изменить свои параметры на другие!
            
            ${menuText}`, {
                keyboard: menuKeyboard
            })
        }

        context.scene.state.userFind = {
            id: userFindRandom.id,
            name: userFindRandom.name,
            photos: userFindRandom.photos,
            desc: userFindRandom.desc,
            age: userFindRandom.age,
            gender: userFindRandom.gender,
            geo: userFindRandom.geo
        };

        let kmText = ``;
        let kmFunc = haversine(
            {
                latitude: userFindRandom.geo.coord.lat,
                longitude: userFindRandom.geo.coord.lon
            },
            {
                latitude: geo.coord.lat,
                longitude: geo.coord.lon
            }
        )

        if (kmFunc > 0) {
            if (kmFunc < 1000) {
                kmText = `, 📍 ${String(kmFunc).split('.')[0]}м`
            } else {
                kmText = `, 📍 ${Math.round(kmFunc / 1000)}км`
            }
        }

        return context.send({
            message: `${userFindRandom.name}, ${userFindRandom.age}, ${userFindRandom.geo.city}${kmText}\n${userFindRandom.desc}`,
            attachment: userFindRandom.photos[0],
            keyboard: menuSearchUserKeyboard(context.scene.state.userFind.id)
        });
    }

    if (!context.messagePayload?.command) return context.send('Нет такого варианта ответа');

    if (context.messagePayload.command == 'like') {
        // лайкаем , говорим тому юзеру и продолжаем  новый подбор
        await userManagers.likeDislikeUser({ type: 'like', whoLiked: context.peerId, whoLikedIt: context.scene.state.userFind.id })
    }

    if (context.messagePayload.command == 'message') {
        // отправляем сообщение и лайкаем
        return await context.scene.step.next();
    }

    if (context.messagePayload.command == 'unlike') {
        // пропускаем и продолжаем подбор
        await userManagers.likeDislikeUser({ type: 'dislike', whoLiked: context.peerId, whoLikedIt: context.scene.state.userFind.id })
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


const stepMessage = async (context) => {
    const text = context.text;
    if (context.scene.step.firstTime || !context.text) return context.send({
        message: `Напиши сообщение для этого пользователя`,
        keyboard: backTmpKeyboard
    });

    if (context.messagePayload?.command == 'back') return await context.scene.step.previous();

    if (text.length < 5) return context.send('Что так мало написал? Давай больше!');
    if (text.length > 1000) return context.send(`Фига как много... Убери ${text.length - 1000} символов!`);

    await userManagers.likeDislikeUser({
        type: 'like',
        whoLiked: context.peerId,
        whoLikedIt: context.scene.state.userFind.id,
        message: text
    })

    return await context.scene.step.previous();
}



const searchUserScene = [stepMain, stepMessage];

module.exports = searchUserScene;