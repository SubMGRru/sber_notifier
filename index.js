import {
    join,
    dirname
} from 'path'
import 'dotenv/config'
import {
    Low,
    JSONFile
} from 'lowdb'
import {
    fileURLToPath
} from 'url'

const __dirname = dirname(fileURLToPath(
    import.meta.url));

// Use JSON file for storage
const file = join(__dirname, 'chats.json')
const adapter = new JSONFile(file)
const db = new Low(adapter)

import TelegramBot from 'node-telegram-bot-api';

// replace the value below with the Telegram token you receive from @BotFather
const token = process.env.TelegramBot_Token;

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {
    polling: true
});

// Matches "/echo [whatever]"
bot.onText(/\/notifier_register/, async (msg) => {
    // 'msg' is the received Message from Telegram
    // 'match' is the result of executing the regexp above on the text content
    // of the message

    const chatId = msg.chat.id;

    if (chatId < 0) {
        await db.read()

        db.data ||= {
            chats: []
        }

        if (db.data.chats.includes(chatId)) {
            bot.sendMessage(chatId, "Уже знаю об этом чате.");
        } else {
            db.data.chats.push(chatId)
            bot.sendMessage(chatId, "Теперь я знаю об этом чате, план скам удался! :)")
            await db.write()
        }
    } else {
        bot.sendMessage(chatId, "БЕЗ СКАМА!!")
    }
});

// Listen for any kind of message. There are different kinds of
// messages.
bot.on('message', async (msg) => {
    const chatId = msg.chat.id;

    // send a message to the chat acknowledging receipt of their message
    if (chatId > 0) {
        if (chatId == "306610259" || chatId == "373523246") {
            const chatId = msg.chat.id;
            await db.read()
            for (var i = 0; i < db.data.chats.length; i++) {
                bot.sendMessage(db.data.chats[i], msg.text);
                console.log(db.data.chats[i])
            }
            bot.sendMessage(chatId, 'Сообщение разослано!');
        } else {
            bot.sendMessage(chatId, 'Привет, я — частный бот и отвечаю только людям, с которыми дружу. Не пиши мне больше!!');
        }
    }
});