const { Scenes, Markup } = require('telegraf');

let ans;

async function getLastNumberWithDigits(digits){
    return Math.pow(10, digits) - 1
}


async function getFirstNumberWithDigits(digits){
    return Math.pow(10, digits - 1)
}

const mult = new Scenes.WizardScene(
    'mult',
    async ctx => {
        //DIGIT num1 digit num2
        //num1 min, max
        //num2 min, max
        const minNum1 = Number(await getFirstNumberWithDigits(ctx.session.user.digitsNum1))
        const maxNum1 = Number(await getLastNumberWithDigits(ctx.session.user.digitsNum1))

        console.log(minNum1, maxNum1)

        const minNum2 = Number(await getFirstNumberWithDigits(ctx.session.user.digitsNum2))
        const maxNum2 = Number(await getLastNumberWithDigits(ctx.session.user.digitsNum2))

        console.log(minNum2, maxNum2)

        const num1 = Math.floor(Math.random() * (maxNum1 - minNum1) + minNum1);
        const num2 = Math.floor(Math.random() * (maxNum2 - minNum2) + minNum2);
        await ctx.replyWithMarkdown(`Напиши ответ \`${num1}*${num2}\``, Markup.inlineKeyboard([
                Markup.button.callback("Выход", "exit")
            ])
        )
        ans = num1 * num2
        return ctx.wizard.next()
    },
    async ctx => {
        if("callback_query" in ctx.update){
            switch(ctx.update.callback_query.data){
                case "exit":
                    return ctx.scene.enter("menu")
            }
        }else {
            if(String(ans) === String(ctx.message.text)){
                ctx.reply("Вы решили правильно! Перехожу к следующему примеру")
                return ctx.scene.enter("mult")
            }else {
                ctx.reply("Ошибка в вычислениях, попробуйте ещё раз")
            }
        }
    }
)

module.exports = {
    scene: mult
}