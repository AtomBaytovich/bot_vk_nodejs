const haversine = require('haversine-distance')

let menuText = `
1. Смотреть анкеты.
2. Моя анкета.
3. Я больше не хочу никого искать.
***
4. ✈ Мой канал в Telegram.
`

let keyboardText = `Используй клавиатуру бота`

let tgChannelText = `Мой ТГ канал по разработке. Авторский интересный контент. \n\nhttps://t.me/atom_baytovich`

const distanceText = ({ lat1, lon1, lat2, lon2 }) => {
    let kmText = ``;
    let kmFunc = haversine(
        {
            latitude: lat1,
            longitude: lon1
        },
        {
            latitude: lat2,
            longitude: lon2
        }
    )

    if (kmFunc > 0) {
        if (kmFunc < 1000) {
            kmText = `, 📍 ${String(kmFunc).split('.')[0]}м`
        } else {
            kmText = `, 📍 ${Math.round(kmFunc / 1000)}км`
        }
    }
    return kmText;
}

module.exports = {
    menuText,
    keyboardText,
    tgChannelText,
    distanceText
}