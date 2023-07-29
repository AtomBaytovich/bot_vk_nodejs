const { _VK } = require("./instance");
const { HearManager } = require("@vk-io/hear");
const { checkUserBd } = require("./middleware/checkUser");
const { SessionManager } = require("@vk-io/session");
const sceneManager = require("./controllers/scenes");
const {
    menuCommands,
    noFoundCommand,
} = require("./controllers/commands");


const vk = _VK;
const { updates } = vk;

const hearManager = new HearManager();
const sessionManager = new SessionManager();

// если сообщение исходящее и не из беседы, то не отвечаем
updates.on('message', async (context, next) => {
    if (context.isOutbox || context.isChat) return;
    return next();
});
// проверяем есть ли запись юзера в бд
updates.on('message_new', checkUserBd)

updates.on(
    ['message_new', 'message_event'],
    [sessionManager.middleware, sceneManager.middleware, sceneManager.middlewareIntercept]
);

// регистрируем менеджер прослушек текстовых сообщ(команд)
updates.on('message_new', hearManager.middleware);

hearManager.hear([/Старт/i, /Начать/i, /Меню/i], menuCommands.menu);
hearManager.hear(['1', 'Вернуться к оценкам', 'Посмотреть анкеты', 'Смотреть анкеты'], menuCommands.seeTmp)
hearManager.hear('2', menuCommands.myTmp)
hearManager.hear('3', menuCommands.noSeeTmp)
hearManager.hear(['✈ 4', '4'], menuCommands.seeTG)
hearManager.hear('5', menuCommands.seeLikesUser)

// команда не найдена
hearManager.onFallback(noFoundCommand);

module.exports = vk;