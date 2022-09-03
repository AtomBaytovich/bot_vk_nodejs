const { Keyboard } = require("vk-io");

const genderKeyboard = Keyboard.builder()
    .textButton({
        label: 'Я девушка',
        payload: {
            type: 'female'
        },
        color: Keyboard.POSITIVE_COLOR
    })
    .textButton({
        label: 'Я парень',
        payload: {
            type: 'male'
        },
        color: Keyboard.POSITIVE_COLOR
    });

const interestingGenderKeyboard = Keyboard.builder()
    .textButton({
        label: 'Девушки',
        payload: {
            type: 'male'
        },
        color: Keyboard.POSITIVE_COLOR
    })
    .textButton({
        label: 'Парни',
        payload: {
            type: 'female'
        },
        color: Keyboard.POSITIVE_COLOR
    })
    .textButton({
        label: 'Всё равно',
        payload: {
            type: 'all'
        },
        color: Keyboard.SECONDARY_COLOR
    });


const locationKeyboard = Keyboard.builder()
    .locationRequestButton({})

const noTextKeyboard = Keyboard.builder()
    .textButton({
        label: 'Без текста',
        payload: {
            command: 'no_text'
        },
        color: Keyboard.SECONDARY_COLOR
    })

const noKeyboard = Keyboard.builder().oneTime();

const myPhotoKeyboard = Keyboard.builder()
    .textButton({
        label: 'Моё фото',
        payload: {
            command: 'my_photo'
        },
        color: Keyboard.SECONDARY_COLOR
    })

module.exports = {
    genderKeyboard,
    interestingGenderKeyboard,
    locationKeyboard,
    noTextKeyboard,
    noKeyboard,
    myPhotoKeyboard
}