import express from 'express';
import Redis from 'ioredis';
import TelegramBot, {
  Message,
  InlineKeyboardMarkup,
  BotCommand,
} from 'node-telegram-bot-api';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });
const isProduction = process.env.NODE_ENV === 'production';
console.log(`Production mode: ${isProduction}`);

// Конфигурация Redis
const redis = new Redis(process.env.REDIS_PROD_URL || 'redis://localhost:6379');

// Конфигурация Telegram бота
const TELEGRAM_TOKEN = isProduction
  ? process.env.BOT_TOKEN
  : process.env.BOT_TOKEN_TEST;

const bot = new TelegramBot(TELEGRAM_TOKEN || '', { polling: true });

const app = express();
const port = 8002;

// Генерация OTP
function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Установка кнопок команд бота
const botCommands: BotCommand[] = [
  {
    command: 'start',
    description: 'Начать использовать сервис',
  },
  {
    command: 'get_otp',
    description: 'Получить OTP код',
  },
];

bot.setMyCommands(botCommands).then(() => {
  console.log('Команды успешно установлены');
});

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
  const callbackData = callbackQuery.data;

  if (callbackData === 'get_otp') {
    const otp = generateOtp();

    // Сохранение OTP в Redis с ключом `otp:chatId` и временем жизни 5 минут
    await redis.set(`otp:${chatId}`, otp, 'EX', 600);

    // Ссылка для ввода OTP на вашем сайте
    const siteUrl = !isProduction
      ? `${process.env.NEXT_PROD_URL}?chatId=${chatId}`.toString()
      : `${process.env.NEXT_PROD_URL}?chatId=${chatId}`.toString();

    const options: InlineKeyboardMarkup = {
      inline_keyboard: [
        [
          {
            text: 'Перейти на сайт',
            url: siteUrl,
          },
        ],
        [
          {
            text: 'Отправить код повторно',
            callback_data: 'copy_otp',
          },
        ],
      ],
    };

    bot.sendMessage(
      chatId || '',
      `Ваш OTP код: ${otp}. Нажмите на кнопку ниже, чтобы скопировать код или перейти на сайт.`,
      {
        reply_markup: options,
      },
    );

    // Уведомляем Telegram, что callback обработан
    bot.answerCallbackQuery(callbackQuery.id);
  }

  if (callbackData === 'copy_otp') {
    // Получаем OTP из Redis
    const otp = await redis.get(`otp:${chatId}`);
    if (otp) {
      bot.sendMessage(chatId || '', otp);
    } else {
      bot.sendMessage(
        chatId || '',
        `OTP не найден. Попробуйте запросить заново.`,
      );
    }

    bot.answerCallbackQuery(callbackQuery.id, {
      text: 'OTP отправлен в чат.',
    });
  }
});

// Обработчик команды /get_otp
bot.onText(/\/get_otp/, async (msg: Message) => {
  const chatId = msg.chat.id;
  const otp = generateOtp();

  // Сохранение OTP в Redis с ключом `otp:chatId` и временем жизни 5 минут
  await redis.set(`otp:${chatId}`, otp, 'EX', 600);

  // Ссылка для ввода OTP на вашем сайте
  const siteUrl = isProduction
    ? `${process.env.NEXT_PROD_URL}?chatId=${chatId}`.toString()
    : `${process.env.NEXT_LOCAL_URL}?chatId=${chatId}`.toString();

  const options: InlineKeyboardMarkup = {
    inline_keyboard: [
      [
        {
          text: 'Перейти на сайт',
          url: siteUrl,
        },
      ],
      [
        {
          text: 'Скопировать OTP',
          callback_data: 'copy_otp',
        },
      ],
    ],
  };

  bot.sendMessage(chatId, `Ваш OTP код: ${otp}`, {
    reply_markup: options,
  });
});

// Маршрут для проверки состояния сервера
app.get('/health', (req, res) => {
  res.send({ message: 'Сервер работает', status: 'OK' });
});

// Поднятие сервера
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
