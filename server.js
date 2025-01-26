const express = require("express");
const bodyParser = require("body-parser");
const { VoiceResponse } = require("twilio").twiml;
const client = require("twilio")("AC63da8572bb2de133aea49941b89056b5", "cb9bebd467d6bd9c793e80f1cc9fea97");
const TelegramBot = require("node-telegram-bot-api");
const cors = require("cors");

const API_KEY_BOT = "5312847705:AAE0ii_TUhEeuNPRV52iiFmB0bsEInhANt4";
const bot = new TelegramBot(API_KEY_BOT, {
    polling: true,
});

// Определение кнопок и клавиатур
const but1 = 'Протидія насильству';

const start_key = [
    [but1],
];

const nasl_bat1 = "Мені потрібна термінова допомога";
const nasl_bat2 = "Дізнайся чи є насильство в твоєму житті";
const nasl_bat3 = "Яку допомогу я можу отримати";

const nasl_key = [
    [nasl_bat1],
    [nasl_bat2],
    [nasl_bat3],
];

const l_bat1 = "Я - дитина або підліток";
const l_bat2 = "Я - дорослий";

const nfl_key = [
    [l_bat1],
    [l_bat2],
];

const nasls_bat1 = "Психологічна допомога";
const nasls_bat2 = "Тимчасовий притулок для жінок та дітей";
const nasls_bat3 = "Соціальний супровід";
const nasls_bat4 = "Сприяння в отриманні юридичної допомоги";
const nasls_bat5 = "Сприяння в отриманні медичної допомоги";

const nasls_key = [
    [nasls_bat1],
    [nasls_bat2],
    [nasls_bat3],
    [nasls_bat4],
    [nasls_bat5],
];

// Обработчик сообщений в Telegram
bot.on('text', async (nextMsg) => {
    try {
        const chatId = nextMsg.from.id;
        switch (nextMsg.text) {
            case "/start":
                bot.sendMessage(chatId, "Оберіть дію:", {
                    reply_markup: {
                        keyboard: start_key,
                        resize_keyboard: true,
                        one_time_keyboard: false,
                    },
                });
                break;

            case but1:
                bot.sendMessage(chatId, "Оберіть:", {
                    reply_markup: {
                        keyboard: nasl_key,
                        resize_keyboard: true,
                        one_time_keyboard: false,
                    },
                });
                break;

            case nasl_bat2:
                bot.sendMessage(chatId, "Оберіть:", {
                    reply_markup: {
                        keyboard: nfl_key,
                        resize_keyboard: true,
                        one_time_keyboard: false,
                    },
                });
                break;

            case nasl_bat1:
                bot.sendMessage(chatId, `Якщо ви постраждали від
насильства або стали його
свідком - телефонуйте на цілодобові безкоштовні «гарячі лінії»
+380668295573 - Притулок
для жінок БО «Світло Надії»
102 - Поліція`);
                break;

            case nasl_bat3:
                bot.sendMessage(chatId, "Оберіть:", {
                    reply_markup: {
                        keyboard: nasls_key,
                        resize_keyboard: true,
                        one_time_keyboard: false,
                    },
                });
                break;

            case '/menu':
                bot.sendMessage(chatId, `Меню:`, {
                    reply_markup: {
                        keyboard: start_key,
                        resize_keyboard: true,
                        one_time_keyboard: false,
                    },
                });
                break;

            case nasls_bat1:
            case nasls_bat2:
            case nasls_bat3:
            case nasls_bat4:
            case nasls_bat5:
                bot.sendMessage(chatId, `Коли Ви відчуваєте себе некомфортно, або в небезпеці - зверніться за консультацією по телефону +380668295573 - Притулок | для жінок БО «Світло Надії»`, {
                    reply_markup: {
                        keyboard: start_key,
                        resize_keyboard: true,
                        one_time_keyboard: false,
                    },
                });
                break;

            default:
                bot.sendMessage(chatId, "Невідомий запит. Натисніть /start для меню.");
                break;
        }
    } catch (e) {
        console.error("ERROR:", e);
    }
});

// Создание Express сервера
const app = express();

const PORT = process.env.PORT || 3001;
// Подключение CORS
app.use(cors());

// Подключение body-parser для обработки JSON
app.use(bodyParser.json());

// Обработчик POST-запроса на /call
app.post("/call", async (req, res) => {
    const { to, message } = req.body;
    console.log("to:", to, "message:", message);
    if (!to || !message) {
        return res.status(400).json({ error: "Номер телефона и текст сообщения обязательны" });
    }

    try {
        await client.calls.create({
            to,
            from: "+14067093516",
            twiml: `<Response><Say>${message}</Say></Response>`,
        });
        res.status(200).json({ success: "Звонок успешно выполнен" });
    } catch (error) {
        console.error("Ошибка при звонке:", error);
        res.status(500).json({ error: "Не удалось выполнить звонок" });
    }
});


// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});