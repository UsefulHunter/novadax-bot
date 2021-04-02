const TelegramBot = require('node-telegram-bot-api');
const fetch = require('node-fetch');
require('dotenv').config();
const bot = new TelegramBot(process.env.BOT_TOKEN, {polling: true});

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

bot.onText(/\/(.+)/, async (msg, match) => {
  console.log(process.env)
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Pesquisando...');
  const resp = match[1]; // the captured "whatever"
  const response = await fetch(`https://api.novadax.com/v1/market/ticker?symbol=${resp.toUpperCase()}_BRL`);

  if (!response.ok) {
    bot.sendMessage(chatId, 'Algo de errado aconteceu');
    return;
  }
  const { data } = await response.json();

  bot.sendMessage(chatId, `Último preço: ${
    Math.round(data.lastPrice) > 0 ? formatCurrency(data.lastPrice) : data.lastPrice
  }\nPreço mais alto: ${
    Math.round(data.high24h) > 0 ? formatCurrency(data.high24h) : data.high24h
  }\nPreço mais baixo: ${
    Math.round(data.low24h) > 0 ? formatCurrency(data.low24h) : data.low24h
  }`);
});
