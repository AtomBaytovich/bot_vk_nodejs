const { _VK } = require("./instance");
const { HearManager } = require("@vk-io/hear");
const { checkUserBd } = require("./middleware/checkUser");
const { SessionManager } = require("@vk-io/session");
const sceneManager = require("./controllers/scenes");

const vk = _VK;
const { updates } = vk;

const hearManager = new HearManager();
const sessionManager = new SessionManager();


updates.on('message', (context, next) => {
    // если сообщение исходящее и не из беседы, то не отвечаем
    if (context.isOutbox || context.isChat) return;
    return next();
});

updates.on('message_new', sessionManager.middleware);
updates.on('message_new', sceneManager.middleware);
updates.on('message_new', sceneManager.middlewareIntercept); // Default scene entry handler

// проверяем есть ли запись юзера в бд
updates.on('message_new', checkUserBd)
// регистрируем менеджер прослушек текстовых сообщ(команд)
updates.on('message_new', hearManager.middleware);


hearManager.hear(/^Начать || Старт || Запуск$/i, async (context) => {
    return context.scene.enter('signup');
});


module.exports = vk;