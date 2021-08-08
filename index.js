const { Telegraf, Markup } = require("telegraf");
const fs = require('fs')

const BOT_TOKEN = 'BOT_TOKEN'
const BOT = new Telegraf(BOT_TOKEN);

const ERROR_CODES = JSON.parse(fs.readFileSync('error_codes.json', 'utf-8'));

function getMenu() {
  return Markup.keyboard([
    ["\/start", "Помощь ❓"],
  ]).resize();
}

BOT.start((ctx) => {
  ctx.replyWithHTML(
    `Расшифровка ошибок осуществляется по официальному документу <b>ATM-RG7_ErrorCode_Calculator</b>.
Коды ошибок необходимо вводить без пробелов.
<b>Пример:</b> 0128b400`, 
    getMenu()
  );
});

BOT.command('start', (ctx) => {
    ctx.replyWithHTML(
        `Введите код ошибки без пробелов.
<b>Пример:</b> 0128b400`, 
        getMenu()
      );
  })

BOT.hears("Помощь ❓", ctx => ctx.replyWithHTML(
    `Введите код ошибки без пробелов. <b>Пример:</b> 0128b400`, 
      getMenu()
    ))

BOT.on('text', (ctx) => {
    result = ERROR_CODES.find(cod => cod.code === ctx.message.text.toUpperCase())
    if(result != undefined) {
        ctx.replyWithHTML(
`<b>DEVICE:</b> ${result.device}
<b>ERROR TYPE:</b> ${result.errorType === 'null' ? 'no info' : result.errorType}
<b>OUTLINE:</b> ${result.outline === 'null' ? 'no info' : result.outline}
<b>ERROR DESCRIPTION:</b> ${result.errorDescription === 'null' ? 'no info' : result.errorDescription}
<b>RECOVERY ACTION:</b> ${result.recoveryAction === 'null' ? 'no info' : result.recoveryAction}`,
             getMenu()
             )
    } else {
        ctx.reply(
            `Не найдено. Проверьте правильность ввода кода`
        )
    }    
})

BOT.launch();
