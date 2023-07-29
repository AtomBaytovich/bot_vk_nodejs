// сцена для принятия и отклонения заявок 

const { menuSearchUserKeyboard, menuKeyboard, backTmpKeyboard, listUserLikesKeyboard } = require("../../utils/buttons");
const { menuText, distanceText } = require("../../utils/text");
const userManagers = require("../userManagers");

const stepMain = async (context) => {

    if (context.scene.step.firstTime || !context.text) {

        const user = context.user;
        if (!user) return;
        const userFindRandom = await userManagers.getListLikes({ id: user.id });
        console.log(userFindRandom)
        /// защита на законченность 
        if (!userFindRandom) {
            await context.scene.leave();
            return context.send(`Упс... Пока что нет тех, кому ты понравился

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

        const kmText = distanceText({
            lat1: userFindRandom.geo.coord.lat,
            lon1: userFindRandom.geo.coord.lon,
            lat2: user.geo.coord.lat,
            lon2: user.geo.coord.lon
        })

        return context.send({
            message: `${userFindRandom.name}, ${userFindRandom.age}, ${userFindRandom.geo.city}${kmText}\n${userFindRandom.desc}`,
            attachment: userFindRandom.photos[0],
            keyboard: listUserLikesKeyboard
        });
    }

    if (!context.messagePayload?.command) return context.send('Нет такого варианта ответа');

    if (context.messagePayload.command == 'like') {
        // лайкаем и отправляем обоим анкету о том, что вы понравились друг другу
        await userManagers.likeDislikeUser({ type: 'like', whoLiked: context.peerId, whoLikedIt: context.scene.state.userFind.id })
    }

    if (context.messagePayload.command == 'unlike') {
        // пропускаем и продолжаем 
        await userManagers.likeDislikeUser({ type: 'dislike', whoLiked: context.peerId, whoLikedIt: context.scene.state.userFind.id })
    }

    if (context.messagePayload.command == 'sleep') {
        await context.scene.leave();
        return context.send(`

${menuText}
        `, {
            keyboard: menuKeyboard
        })
    }

    await context.scene.leave();
    return context.scene.enter('likeListUsers');
}


const likeListUsersScene = [stepMain];

module.exports = likeListUsersScene;