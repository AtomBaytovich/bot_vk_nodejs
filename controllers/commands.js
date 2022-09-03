const menuCommands = {
    // смотреть анкеты
    seeTmp: async function (context) {
        console.log(context)
        return context.scene.enter('searchUser');
    }
}


module.exports = {
    menuCommands
}