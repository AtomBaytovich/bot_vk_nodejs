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
            type: 'female'
        },
        color: Keyboard.POSITIVE_COLOR
    })
    .textButton({
        label: 'Парни',
        payload: {
            type: 'male'
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

const confirmFormKeyboard = Keyboard.builder()
    .textButton({
        label: 'Да',
        payload: {
            command: 'yes'
        },
        color: Keyboard.POSITIVE_COLOR
    })
    .textButton({
        label: 'Заполнить заново',
        payload: {
            command: 'no'
        },
        color: Keyboard.SECONDARY_COLOR
    })


const menuKeyboard = Keyboard.builder()
    .textButton({
        label: '1',
        color: Keyboard.POSITIVE_COLOR
    })
    .textButton({
        label: '2',
        color: Keyboard.SECONDARY_COLOR
    })
    .textButton({
        label: '3',
        color: Keyboard.SECONDARY_COLOR
    })
    .textButton({
        label: '✈ 4',
        color: Keyboard.SECONDARY_COLOR
    })


const menuSearchUserKeyboard = (id) => Keyboard.builder()
    .textButton({
        label: '❤',
        payload: {
            command: 'like'
        },
        color: Keyboard.POSITIVE_COLOR
    })
    .textButton({
        label: '💌',
        payload: {
            command: 'message',
            idVk: id
        },
        color: Keyboard.SECONDARY_COLOR
    })
    .textButton({
        label: '👎',
        payload: {
            command: 'unlike'
        },
        color: Keyboard.SECONDARY_COLOR
    })
    .textButton({
        label: '💤',
        payload: {
            command: 'sleep'
        },
        color: Keyboard.SECONDARY_COLOR
    })

const listUserLikesKeyboard = Keyboard.builder()
    .textButton({
        label: '❤',
        payload: {
            command: 'like'
        },
        color: Keyboard.POSITIVE_COLOR
    })
    .textButton({
        label: '👎',
        payload: {
            command: 'unlike'
        },
        color: Keyboard.SECONDARY_COLOR
    })
    .textButton({
        label: '💤',
        payload: {
            command: 'sleep'
        },
        color: Keyboard.SECONDARY_COLOR
    })

const backScoreKeyboard = Keyboard.builder()
    .textButton({
        label: 'Вернуться к оценкам',
        payload: {
        },
        color: Keyboard.SECONDARY_COLOR
    })

const myTmpKeyboard = Keyboard.builder()
    .textButton({
        label: '1',
        payload: {
            command: '1'
        },
        color: Keyboard.NEGATIVE_COLOR
    })
    .textButton({
        label: '2',
        payload: {
            command: '2'
        },
        color: Keyboard.SECONDARY_COLOR
    })
    .textButton({
        label: '3',
        payload: {
            command: '3'
        },
        color: Keyboard.SECONDARY_COLOR
    })
    .textButton({
        label: '✈ 4',
        payload: {
            command: '4'
        },
        color: Keyboard.SECONDARY_COLOR
    })
    .row()
    .textButton({
        label: 'Вернуться к оценкам',
        payload: {
            command: '5'
        },
        color: Keyboard.POSITIVE_COLOR
    })


const oneOrTwoKeyboard = Keyboard.builder()
    .textButton({
        label: '1',
        color: Keyboard.SECONDARY_COLOR
    })
    .textButton({
        label: '2',
        color: Keyboard.POSITIVE_COLOR
    })

const seeTmpKeyboard = Keyboard.builder()
    .textButton({
        label: 'Посмотреть анкеты',
        color: Keyboard.POSITIVE_COLOR
    })


const backTmpKeyboard = Keyboard.builder()
    .textButton({
        label: 'Вернуться назад',
        payload: {
            command: 'back'
        },
        color: Keyboard.SECONDARY_COLOR
    })

const backKeyboard = Keyboard.builder()
    .textButton({
        label: 'Вернуться назад',
        payload: {
            command: 'back'
        },
        color: Keyboard.SECONDARY_COLOR
    })

const myTmpPhoto = Keyboard.builder()
    .textButton({
        label: '1',
        payload: {
            command: 'my_photo'
        },
        color: Keyboard.SECONDARY_COLOR
    })
    .textButton({
        label: '2',
        payload: {
            command: 'back'
        },
        color: Keyboard.SECONDARY_COLOR
    })

const tmpNewOneTimeKeyboard = ({ text }) => Keyboard.builder().oneTime()
    .textButton({
        label: text,
        payload: {
            command: 'keep'
        },
        color: Keyboard.SECONDARY_COLOR
    })

module.exports = {
    genderKeyboard,
    interestingGenderKeyboard,
    locationKeyboard,
    noTextKeyboard,
    noKeyboard,
    myPhotoKeyboard,
    confirmFormKeyboard,
    menuKeyboard,
    menuSearchUserKeyboard,
    backScoreKeyboard,
    myTmpKeyboard,
    oneOrTwoKeyboard,
    seeTmpKeyboard,
    backTmpKeyboard,
    backKeyboard,
    myTmpPhoto,
    tmpNewOneTimeKeyboard,
    listUserLikesKeyboard
}