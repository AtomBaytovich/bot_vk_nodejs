require('dotenv').config({ path: './config/.env' });

const mongoose = require("mongoose");
const vk = require('./bot');


(async function () {
    try {
        mongoose.set('strictQuery', true);
        await mongoose.connect(process.env.BD_TOKEN, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            dbName: 'vkWine'
        });

        await vk.updates.start();
        console.log('Бот успешно запущен')

    } catch (error) {
        console.log('Произошла ошибка: ', error)
    }
})();