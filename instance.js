const { VK, API } = require("vk-io");

const _VK = new VK({
    token: process.env.BOT_TOKEN
});

const _API_VK = new API({
	token: process.env.BOT_TOKEN
});

module.exports = {
    _VK,
    _API_VK
};