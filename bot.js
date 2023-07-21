const { _VK, _API_VK } = require("./instance");
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


updates.on('message', async (context, next) => {
    // если сообщение исходящее и не из беседы, то не отвечаем
    if (context.isOutbox || context.isChat) return;
    return next();
});

updates.on(['message_new', 'message_event'], sessionManager.middleware);
updates.on(['message_new', 'message_event'], sceneManager.middleware);
updates.on(['message_new', 'message_event'], sceneManager.middlewareIntercept); // Default scene entry handler

// проверяем есть ли запись юзера в бд
updates.on('message_new', checkUserBd)
// регистрируем менеджер прослушек текстовых сообщ(команд)
updates.on('message_new', hearManager.middleware);


updates.on('message_event', async (context, next) => {
    console.log(context)
    if (context.eventPayload) {
        await context.scene.enter('searchUser');
        
    }
    next()
})


hearManager.hear('Старт', async (context) => {
    context.reply('Я помню тебя!',)
});

hearManager.hear(['1', 'Вернуться к оценкам', 'Посмотреть анкеты', 'Смотреть анкеты'], menuCommands.seeTmp)
hearManager.hear('2', menuCommands.myTmp)
hearManager.hear('3', menuCommands.noSeeTmp)
hearManager.hear(['✈ 4', '4'], menuCommands.seeTG)

// команда не найдена
hearManager.onFallback(noFoundCommand);

module.exports = vk;