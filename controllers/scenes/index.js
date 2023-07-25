const { SceneManager, StepScene } = require("@vk-io/scenes");
const createUserScene = require("./createUser");
const searchUserScene = require("./searchUser");
const offSeeTmpScene = require("./offSeeTmp");
const myTmpScene = require("./myTmp");
const likeListUsersScene = require("./listLikes");
const sceneManager = new SceneManager();


sceneManager.addScenes([
    new StepScene('signup', createUserScene),
    new StepScene('searchUser', searchUserScene),
    new StepScene('offSeeTmp', offSeeTmpScene),
    new StepScene('myTmp', myTmpScene),
    new StepScene('likeListUsers', likeListUsersScene)
]);

module.exports = sceneManager;