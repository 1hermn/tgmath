const { Scenes, Markup } = require('telegraf');

const menu = new Scenes.WizardScene(
    'menu',
    async ctx => {
        ctx.reply("Выберите пункт меню", Markup.inlineKeyboard([
            [
                Markup.button.callback("2*2", "2*2"),
                Markup.button.callback("1*2", "1*2"),
                Markup.button.callback("2*3", "2*3"),
                Markup.button.callback("3*3", "3*3")
            ],
            [
                Markup.button.callback("3/2", "3/2")
            ]
        ]))
        return ctx.wizard.next();
    },
    async ctx => {
        if ("callback_query" in ctx.update) {
            if (ctx.update.callback_query.data.indexOf("*") !== -1) {
                const info = ctx.update.callback_query.data.split("*")
                ctx.session.user.digitsNum1 = info[0]
                ctx.session.user.digitsNum2 = info[1]
                return ctx.scene.enter("mult")
            } else if (ctx.update.callback_query.data.indexOf("/") !== -1) {
                const info = ctx.update.callback_query.data.split("/")
                ctx.session.user.digitsNum1 = info[0]
                ctx.session.user.digitsNum2 = info[1]
                try {
                    return ctx.scene.enter("div")
                }catch (e) {
                    ctx.reply("Будет добавлено в следующем обновлении")
                }
            }
        }
    }
)

module.exports = {
    scene: menu
}