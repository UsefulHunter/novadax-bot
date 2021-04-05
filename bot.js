const TelegramBot = require('node-telegram-bot-api');
const fetch = require('node-fetch');
const lodash = require('lodash');
const token = process.env.BOT_TOKEN;
const helpers = require('./helpers.js');

let bot;

if(process.env.NODE_ENV === 'production') {
  bot = new TelegramBot(token);
  bot.setWebHook(process.env.HEROKU_URL + bot.token);
}
else {
  bot = new TelegramBot(token, { polling: true });
}

console.log('Bot server started in the ' + process.env.NODE_ENV + ' mode');

bot.onText(
  /\/percent/,
  async (msg, match) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Pesquisando...');

    const response = await fetch('https://api.novadax.com/v1/market/tickers');
      if (!response.ok) {
        bot.sendMessage(chatId, 'Algo de errado aconteceu');
        return;
      }
      const { data } = await response.json();

      const dataFormatted = data.filter((x) => x.symbol.includes('_BRL')).reduce(function(acc, curr) {
        return [...acc, { symbol: [curr.symbol.replace('_BRL', '')], value: helpers.format24hPercent(curr) * 100 }];
      }, [])

      const message = lodash.orderBy(dataFormatted, ['value'], ['desc']).reduce(function(acc, curr) {
        return acc = `${acc}${curr.symbol}: ${curr.value/100}%\n`;
      }, '')

      bot.sendMessage(chatId, message);
  }
);

bot.onText(
  /\/(ADA|ada)|(BCH|bch)|(BNB|bnb)|(BRZ|brz)|(BSV|bsv)|(BTC|btc)|(BTT|btt)|(DAI|dai)|(DASH|dash)|(DCR|dbc)|(DGB|dgb)|(DOGE|doge)|(DOT|dot)|(EOS|eos)|(ETC|etc)|(ETH|eth)|(IOTA|iota)|(LINK|link)|(LTC|ltc)|(NULS|nuls)|(OMG|omg)|(PUNDIX|pundix)|(TRX|trx)|(XRP|xrp)|(WAVES|waves)/,
  async (msg, match) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Pesquisando...');
    const resp = match[0]; // the captured coin
    const response = await fetch(`https://api.novadax.com/v1/market/ticker?symbol=${resp.toUpperCase()}_BRL`);

    if (!response.ok) {
      bot.sendMessage(chatId, 'Algo de errado aconteceu');
      return;
    }
    const { data } = await response.json();

    const lastPrice = Math.round(data.lastPrice) > 0 ? helpers.formatCurrency(data.lastPrice) : data.lastPrice;
    const hightPrice = Math.round(data.high24h) > 0 ? helpers.formatCurrency(data.high24h) : data.high24h;
    const lowerPrice = Math.round(data.low24h) > 0 ? helpers.formatCurrency(data.low24h) : data.low24h;
    const percentRange = helpers.format24hPercent(data);

    bot.sendMessage(
      chatId,
      `Último preço: ${lastPrice}\nPreço mais alto: ${hightPrice}\nPreço mais baixo: ${lowerPrice}\nA variação em 24h foi de ${percentRange}%`
    );
  }
);

bot.onText(/brabo/,async (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId,'Carai esse bot do Kazushi é brabo mermo ein')
})

module.exports = bot;