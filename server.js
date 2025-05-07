const express = require("express");
const { VoiceResponse } = require("twilio").twiml;
const client = require("twilio")("AC63da8572bb2de133aea49941b89056b5", "cb9bebd467d6bd9c793e80f1cc9fea97");
const TelegramBot = require("node-telegram-bot-api");
const cors = require("cors");

const API_KEY_BOT = "8061891034:AAGXiMbTsGWcMezY7j72h1yGAvhDptb1Cgs";
const bot = new TelegramBot(API_KEY_BOT, { webHook: true });


const URL = process.env.APP_URL || "https://serverdf-5c9c8eec8694.herokuapp.com";


const but1 = 'Протидія насильству 🚫';
const but2 = 'Екстрена допомога 🚑';
const start_key = [[but1], [but2]];

const nasl_bat1 = "Мені потрібна термінова допомога 🆘";
const nasl_bat2 = "Дізнайся чи є насильство в твоєму житті ❓";
const nasl_bat3 = "Яку допомогу я можу отримати 🤝";
const nasl_key = [[nasl_bat1], [nasl_bat2], [nasl_bat3]];

const l_bat1 = "Я - дитина або підліток 👶🧒";
const l_bat2 = "Я - дорослий 👨👩";
const nfl_key = [[l_bat1], [l_bat2]];






const nasls_bat1 = "Психологічна допомога 🧠💬";
const nasls_bat2 = "Тимчасовий притулок для жінок та дітей 🏠👩👧";
const nasls_bat3 = "Соціальний супровід 🤲";
const nasls_bat4 = "Сприяння в отриманні юридичної допомоги ⚖️";
const nasls_bat5 = "Сприяння в отриманні медичної допомоги 🏥";
const nasls_key = [[nasls_bat1], [nasls_bat2], [nasls_bat3], [nasls_bat4], [nasls_bat5]];
const questionsChild = [
    "Чи кричать на вас вдома без причини?",
    "Чи боїтеся ви когось зі своїх рідних?",
    "Чи ображають вас словами або принижують?",
    "Чи почуваєтеся ви небезпечно вдома?"
];

const questionsAdult = [
    "Чи контролює ваш партнер ваші дії або фінанси?",
    "Чи погрожує вам ваш партнер або хтось із рідних?",
    "Чи відчуваєте ви себе пригніченими через відносини?",
    "Чи забороняє вам хтось спілкуватися з друзями або сім’єю?"
];
const yes_no_answers = ["Так", "Ні"];



const callfw= async (res,to,message) =>{

    if (!to || !message) {
        return () => {if (res) {res.status(400).json({ error: "Номер телефона та кординати обов`язкові" });}}
    }

    try {
        await client.calls.create({
            to,
            from: "+14067093516", 
            twiml: `<Response>
                        <Say rate="x-slow">${message}</Say>
                    </Response>`
        });
        if (res) {res.status(200).json({ success: "Дзвінок створено" });}
    } catch (error) {
        console.error("Помилка при виклику:", error);
        if (res) {res.status(500).json({ error: "Не вдалося викликати" });}
    }
    

}


bot.on('text', async (nextMsg) => {
    try {
        const chatId = nextMsg.from.id;
        switch (nextMsg.text) {
            case "/start":
                bot.sendMessage(chatId, "Оберіть дію:", {
                    reply_markup: { keyboard: start_key, resize_keyboard: true }
                });
                break;
            case but2: 

            bot.sendMessage(chatId, "Якщо ви піддаєтесь домашньому або гендерно зумовленому насильству, ви можете отримати допомогу від мобільної бригади, яка зможе надати психологічну підтримку та доставити вас до притулку, де вам зможуть допомогти психологи.");


            bot.sendMessage(chatId, "Допомога автоматично викликається, якщо ви натиснете на кнопку для передачі ваших поточних координат. При натисканні цієї кнопки ваші координати автоматично відправляються, і створюється автономний виклик до оператора, який отримує ваші координати. Оператор передає інформацію вільній мобільній бригаді, що ви потребуєте допомоги. Як тільки з’являється вільна бригада, вона вирушає до вас на допомогу.");
    

            const key = {
                reply_markup: {
                    keyboard: [[{ text: "📍 Надати геопизицію", request_location: true }]],
                    resize_keyboard: true, 
                    one_time_keyboard: true 
                }
            };
            
            setTimeout(() => {
                bot.sendMessage(chatId, "Запит про геопизицію:", key)
            },100);

            break;
            case but1:
                bot.sendMessage(chatId, "Оберіть:", {
                    reply_markup: { keyboard: nasl_key, resize_keyboard: true }
                });
                break;

            case nasl_bat1:
                bot.sendMessage(chatId, `Якщо ви постраждали від насильства або стали його свідком - телефонуйте на цілодобові безкоштовні «гарячі лінії» +380668295573 - Притулок для жінок БО «Світло Надії» 102 - Поліція`);
                break;

            case nasl_bat2:
                bot.sendMessage(chatId, "Оберіть:", {
                    reply_markup: { keyboard: nfl_key, resize_keyboard: true }
                });
                break;

            case l_bat1:
                askQuestions(chatId, questionsChild, 0, 0);
                break;
            
            case l_bat2:
                askQuestions(chatId, questionsAdult, 0, 0);
                break;

            case nasl_bat3:
                bot.sendMessage(chatId, "Оберіть:", {
                    reply_markup: { keyboard: nasls_key, resize_keyboard: true }
                });
                break;

            case nasls_bat1:
            case nasls_bat2:
            case nasls_bat3:
            case nasls_bat4:
            case nasls_bat5:
                bot.sendMessage(chatId, `Коли Ви відчуваєте себе некомфортно, або в небезпеці - зверніться за консультацією по телефону +380668295573 - Притулок для жінок БО «Світло Надії»`, {
                    reply_markup: { keyboard: start_key, resize_keyboard: true }
                });
                break;

            default:     
            if (yes_no_answers.includes(nextMsg.text)) {
                break;
            }
                bot.sendMessage(chatId, "Невідомий запит. Натисніть /start для меню.");
                break;
        }
    } catch (e) {
        console.error("ERROR:", e);
    }
});

bot.on('location', (msg) => {
    const chatId = msg.chat.id;
    const latitude = msg.location.latitude;  
    const longitude = msg.location.longitude;  

    callfw('+380665190154',`Call for help at the coordinates: ${longitude} ${latitude}`);
    bot.sendMessage(chatId, `Ваша геопозиція: Широта: ${latitude}, Долгота: ${longitude}`);
});


function askQuestions(chatId, questions, index, score) {
    if (index < questions.length) {
        bot.sendMessage(chatId, questions[index], {
            reply_markup: { keyboard: [["Так", "Ні"]], resize_keyboard: true, one_time_keyboard: true }
        }).then(() => {
            bot.once('text', (msg) => {
                if (msg.text === "Так") {
                    score++;
                }
                askQuestions(chatId, questions, index + 1, score);
            });
        });
    } else {
        let resultMsg = score >= 2 ? "Є ознаки насильства, варто звернутися по допомогу." : "Ознак насильства не виявлено, але будьте уважні.";
        bot.sendMessage(chatId, resultMsg, {
            reply_markup: { keyboard: start_key, resize_keyboard: true }
        });
    }
}

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(cors({
    origin: "https://krok-do-phs.vercel.app", 
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  }));
app.post("/call", async (req, res) => {
    const { to, message } = req.body;
    callfw(res,to,message);
});
bot.setWebHook(`${URL}/bot${API_KEY_BOT}`);

app.post(`/bot${API_KEY_BOT}`, (req, res) => {
    bot.processUpdate(req.body);
    res.sendStatus(200);
});
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});