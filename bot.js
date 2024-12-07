const express = require('express');
const TelegramBot = require('node-telegram-bot-api');

const app = express();
const port = 4000;

// Setup Telegram Bot
const token = '7833057978:AAFtMkxLL84qgtTTvuoZ3lhjoz3oXvUO6KU'; // Replace with your bot token
const bot = new TelegramBot(token, { polling: true });

// Function to get current and next day order
const getDayOrder = () => {
    const today = new Date('2024-09-25'); // Use current date in production
    const dayOrderMap = {
        3: 'Day Order 3',
        4: 'Day Order 4',
        // Add more mappings as needed
    };
    
    const todayOrder = today.getDate() % 6 + 3; // Custom logic for day order calculation
    const tomorrowOrder = (todayOrder === 4) ? 3 : todayOrder + 1; // Cycle through day orders

    return {
        todayOrder: dayOrderMap[todayOrder] || 'Unknown',
        tomorrowOrder: dayOrderMap[tomorrowOrder] || 'Unknown'
    };
};

// Welcome message and options
bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, 'Welcome! Please choose an option:', {
        reply_markup: {
            inline_keyboard: [
                [{ text: "View Timetable", callback_data: "timetable" }],
                [{ text: "Day Order", callback_data: "day_order" }],
                [{ text: "Assignments", callback_data: "assignments" }],
                [{ text: "Exam Schedule", callback_data: "exam_schedule" }],
                [{ text: "Semester", callback_data: "semester" }],
                [{ text: "Marks", callback_data: "marks" }],
                [{ text: "Attendance", callback_data: "attendance" }],
            ],
        },
    });
});

// Handle callback queries
bot.on('callback_query', (callbackQuery) => {
    const chatId = callbackQuery.message.chat.id;
    const action = callbackQuery.data;

    switch (action) {
        case 'timetable':
            const { todayOrder, tomorrowOrder } = getDayOrder();
            bot.sendMessage(chatId, `Today's day order is: ${todayOrder}\nTomorrow's day order is: ${tomorrowOrder}`);
            break;
        case 'day_order':
            const currentDayOrder = getDayOrder().todayOrder;
            bot.sendMessage(chatId, `Today is: ${currentDayOrder}`);
            break;
        case 'assignments':
            bot.sendMessage(chatId, 'Here are your assignments...');
            break;
        case 'exam_schedule':
            bot.sendMessage(chatId, 'Here is your exam schedule...');
            break;
        case 'semester':
            bot.sendMessage(chatId, 'Here is your semester information...');
            break;
        case 'marks':
            bot.sendMessage(chatId, 'Here are your marks...');
            break;
        case 'attendance':
            bot.sendMessage(chatId, 'Here is your attendance...');
            break;
        default:
            bot.sendMessage(chatId, 'Invalid option selected.');
            break;
    }
});

// Your Express.js routes here...
app.get('/', (req, res) => {
    res.send('Server is running!');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://127.0.0.1:${port}`);
});
