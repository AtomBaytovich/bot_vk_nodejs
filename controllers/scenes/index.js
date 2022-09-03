const { SceneManager, StepScene } = require("@vk-io/scenes");
const createUserScene = require("./createUser");
const sceneManager = new SceneManager();


sceneManager.addScenes([
    new StepScene('signup', createUserScene)
]);

module.exports = sceneManager;