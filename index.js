const { Telegraf, Scenes, session } = require('telegraf');

const log4js = require("log4js");
const fs = require("fs");

const API_TOKEN = process.env.API_TOKEN || '';
const PORT = process.env.PORT || 3000;
const URL = process.env.URL

const bot = new Telegraf(API_TOKEN);
bot.telegram.setWebhook(`${URL}/bot${API_TOKEN}`);
bot.startWebhook(`/bot${API_TOKEN}`, null, PORT)

const logger = log4js.getLogger("Bot");
logger.level = "debug";

const stageArray = [];
folders = fs.readdirSync("./scenes/")
logger.debug("\n===============Бот запущен===============\n")
logger.debug("Начинаю загрузку сцен")
for(let folder in folders) {
    let path = "./scenes/" + folders[folder] + "/"
    logger.debug("Перехожу в каталог", path)
    let files = fs.readdirSync(path)
    files.forEach(file =>{
        if (!file.endsWith(".js")) return;
        let sceneName = file.split(".")[0];
        const { scene } = require(`${path}${file}`)
        logger.debug("\tСцена", sceneName, " загружена")
        stageArray.push(scene)
    })
}

const stage = new Scenes.Stage(stageArray)

bot.use(session());
bot.use(stage.middleware())

bot.command('start', async ctx => {
    ctx.session.user = {}
    await ctx.scene.enter("menu")
})

bot.on("message", async ctx => {
    ctx.session.user = {}
    await ctx.scene.enter("menu")
})

bot.on("callback_query", async ctx => {
    ctx.session.user = {}
    await ctx.scene.enter("menu")
})

bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))