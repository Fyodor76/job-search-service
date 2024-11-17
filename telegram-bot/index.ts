import express from 'express';
import Redis from 'ioredis';
import TelegramBot, {
  Message,
  InlineKeyboardMarkup,
} from 'node-telegram-bot-api';
import dotenv from 'dotenv';

dotenv.config();
// Конфигурация Redis
const redis = new Redis(process.env.REDIS_PROD_URL || 'redis://localhost:6379');

// Конфигурация Telegram бота
const TELEGRAM_TOKEN = Boolean(process.env.NODE_ENV)
  ? process.env.BOT_TOKEN
  : process.env.BOT_TOKEN_TEST;

console.log(TELEGRAM_TOKEN, 'telegram token');

const bot = new TelegramBot(TELEGRAM_TOKEN || '', { polling: true });

const app = express();
const port = 8002;

// Генерация OTP
function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Обработчик команды /start
bot.onText(/\/start/, (msg: Message) => {
  const chatId = msg.chat.id;

  const welcomeMessage = 'Добро пожаловать в Job Search Service!';

  const options: InlineKeyboardMarkup = {
    inline_keyboard: [
      [
        {
          text: 'Получить OTP код',
          callback_data: 'get_otp',
        },
      ],
    ],
  };

  bot.sendMessage(chatId, welcomeMessage, {
    reply_markup: options,
  });
});

// Обработчик для получения OTP через кнопку
bot.on('callback_query', async (callbackQuery) => {
  const chatId = callbackQuery?.message?.chat?.id;
  const otp = generateOtp();

  // Сохранение OTP в Redis с ключом `otp:chatId` и временем жизни 5 минут
  await redis.set(`otp:${chatId}`, otp, 'EX', 600);

  // Ссылка для ввода OTP на вашем сайте
  const siteUrl = `https://yourwebsite.com/verify?chatId=${chatId}`;

  bot.sendMessage(
    chatId || '',
    `Ваш OTP: ${otp}. Введите его на сайте по следующей ссылке: ${siteUrl}`,
  );
});

// Маршрут для проверки состояния сервера
app.get('/health', (req, res) => {
  res.send({ message: 'Сервер работает', status: 'OK' });
});

// Поднятие сервера
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
