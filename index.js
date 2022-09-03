require('dotenv').config({ path: './config/.env' });

const mongoose = require("mongoose");
const vk = require('./bot');


(async function () {
    try {
        await mongoose.connect(process.env.BD_TOKEN, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            dbName: 'tgBot'
        });

        await vk.updates.start();
        console.log('Бот успешно запущен')

    } catch (error) {
        console.log('Произошла ошибка: ', error)
    }
})();