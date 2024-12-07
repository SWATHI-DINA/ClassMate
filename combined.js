const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const app = express();
const port = 4000; // Ensure this matches the port used in your bot

// Setup Telegram Bot
const token = '7833057978:AAFtMkxLL84qgtTTvuoZ3lhjoz3oXvUO6KU'; // Replace with your bot token
const bot = new TelegramBot(token, { polling: true });

// Updated timetable data
const timetable = {
    day1: {
        day: "Day 1",
        subjects: [
            { hour: 1, subject: "CN" },
            { hour: 2, subject: "AIML" },
            { hour: 3, subject: "OOSE" },
            { hour: 4, subject: "SST" },
            { hour: 5, subject: "CN" },
            { hour: 6, subject: "EDA" },
            { hour: 7, subject: "TECH" }
        ],
    },
    day2: {
        day: "Day 2",
        subjects: [
            { hour: 1, subject: "AIML" },
            { hour: 2, subject: "PL/HONS" },
            { hour: 3, subject: "EDA" },
            { hour: 4, subject: "PL/HONS" },
            { hour: 5, subject: "AIML/CN Lab" },
            { hour: 6, subject: "AIML/CN Lab" },
            { hour: 7, subject: "AIML/CN Lab" }
        ],
    },
    day3: {
        day: "Day 3",
        subjects: [
            { hour: 1, subject: "OOSE" },
            { hour: 2, subject: "COE" },
            { hour: 3, subject: "AAD Lab" },
            { hour: 4, subject: "AAD Lab" },
            { hour: 5, subject: "TOC" },
            { hour: 6, subject: "AAD" },
            { hour: 7, subject: "TOC" }
        ],
    },
    day4: {
        day: "Day 4",
        subjects: [
            { hour: 1, subject: "TOC" },
            { hour: 2, subject: "CN/OOSE LAB" },
            { hour: 3, subject: "CN/OOSE LAB" },
            { hour: 4, subject: "CN/OOSE LAB" },
            { hour: 5, subject: "TOC" },
            { hour: 6, subject: "AAD" },
            { hour: 7, subject: "TOC" }
        ],
    },
    day5: {
        day: "Day 5",
        subjects: [
            { hour: 1, subject: "EDA LAB" },
            { hour: 2, subject: "EDA LAB" },
            { hour: 3, subject: "TOC" },
            { hour: 4, subject: "CN" },
            { hour: 5, subject: "OOSE/AIML LAB" },
            { hour: 6, subject: "OOSE/AIML LAB" },
            { hour: 7, subject: "OOSE/AIML Lab/HONS" }
        ],
    },
    day6: {
        day: "Day 6",
        subjects: [
            { hour: 1, subject: "EDA" },
            { hour: 2, subject: "OOSE" },
            { hour: 3, subject: "AAD" },
            { hour: 4, subject: "TOC" },
            { hour: 5, subject: "AIML" },
            { hour: 6, subject: "CN" },
            { hour: 7, subject: "APT" }
        ],
    }
};

// Exam and assignment schedule
const examSchedule = {
    assignments_duedate: {
        "CN": "2024-10-01",
        "AIML": "2024-10-05",
        "OOSE": "2024-10-07",
        "EDA": "2024-10-09",
        "TOC": "2024-10-10",
        "AAD": "2024-10-11",
    },
    unitTests: {
        "CN": "2024-10-10",
        "AIML": "2024-10-15",
        "OOSE": "2024-10-20",
        "EDA": "2024-10-09",
        "TOC": "2024-10-10",
        "AAD": "2024-10-11",
    },
    internalTests3: {
        "TOC": "2024-10-14",
        "CN": "2024-10-10",
        "AIML": "2024-10-15",
        "OOSE": "2024-10-20",
        "EDA": "2024-10-09",
        "AAD": "2024-10-11",
    },
    semesterExams: {
        "Semester 5": "2024-12-01",
    }
};

// Function to get the day order based on the current date
const getDayOrder = (date) => {
    const dayOfWeek = date.getDay(); // Sunday = 0, Monday = 1, ..., Saturday = 6
    // Assuming Day 1 starts on Monday
    if (dayOfWeek === 0) {
        return 6; // If it's Sunday, it should return Day Order 6 (saturday) the world has reacghed its
    } else {
        return dayOfWeek; // Returns the corresponding day order (1 for Monday, 6 for Saturday)
    } 
};

// Endpoint to get timetable for a specific day
app.get('/api/timetable/:day', (req, res) => {
    const day = req.params.day;
    const data = timetable[day.toLowerCase()]; // Making it case insensitive

    if (data) {
        res.json(data);
    } else {
        res.status(404).json({ error: 'Day not found' });
    }
});

// Endpoint to get exam and assignment schedule
app.get('/api/schedule', (req, res) => {
    res.json(examSchedule);
});

// Welcome message and options
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    console.log(msg,"msg");
    if (msg.contact) {
        const phoneNumber = msg.contact.phone_number;
        const userName = msg.contact.first_name || msg.contact.last_name || 'User';

        bot.sendMessage(chatId, `Thank you, ${userName}! Your phone number is ${phoneNumber}.`);
        // You can now save this number to your database or use it as needed
    }
    bot.sendMessage(msg.chat.id, 'Welcome! Please choose an option:', {
        reply_markup: {
            inline_keyboard: [
                [{ text: "View Timetable", callback_data: "timetable" }],
                [{ text: "Day Order", callback_data: "day_order" }],
                [{ text: "Assignments", callback_data: "assignments" }],
                [{ text: "Unit Tests", callback_data: "unit_tests" }],
                [{ text: "Internal Tests", callback_data: "internal_tests" }],
                [{ text: "Semester", callback_data: "semester" }],
                [{ text: "Marks", callback_data: "marks" }],
                [{ text: "Attendance", callback_data: "attendance" }],
            ],
        },
    });
});

// Handle callback queries
bot.on('callback_query', async (callbackQuery) => {
    const chatId = callbackQuery.message.chat.id;
    const action = callbackQuery.data;

    // Get today's day order
    const today = new Date();
    const todayOrder = getDayOrder(today); // Day order based on day of the week
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const yesterdayOrder = getDayOrder(yesterday);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const tomorrowOrder = getDayOrder(tomorrow);

    switch (action) {
        case 'timetable':
            try {
                const response = await axios.get(`http://localhost:${port}/api/timetable/day${todayOrder}`);
                const timetableData = response.data;
                bot.sendMessage(chatId, `Today's ${timetableData.day}:\n` +
                    timetableData.subjects.map(sub => `Hour ${sub.hour}: ${sub.subject}`).join('\n'));
            } catch (error) {
                bot.sendMessage(chatId, 'Failed to fetch timetable.');
            }
            break;
        case 'day_order':
            bot.sendMessage(chatId, `Today's Day Order: ${todayOrder}\nYesterday's Day Order: ${yesterdayOrder}\nTomorrow's Day Order: ${tomorrowOrder}`);
            break;
        case 'assignments':
            try {
                const response = await axios.get(`http://localhost:${port}/api/schedule`);
                const assignments = response.data.assignments_duedate;
                bot.sendMessage(chatId, `Assignments Due Dates:\n` +
                    Object.entries(assignments).map(([subject, date]) => `${subject}: ${date}`).join('\n'));
            } catch (error) {
                bot.sendMessage(chatId, 'Failed to fetch assignments.');
            }
            break;
        case 'unit_tests':
            try {
                const response = await axios.get(`http://localhost:${port}/api/schedule`);
                const unitTests = response.data.unitTests;
                bot.sendMessage(chatId, `Unit Test Dates:\n` +
                    Object.entries(unitTests).map(([subject, date]) => `${subject}: ${date}`).join('\n'));
            } catch (error) {
                bot.sendMessage(chatId, 'Failed to fetch unit tests.');
            }
            break;
        case 'internal_tests':
            try {
                const response = await axios.get(`http://localhost:${port}/api/schedule`);
                const internalTests = response.data.internalTests3;
                bot.sendMessage(chatId, `Internal Test Dates:\n` +
                    Object.entries(internalTests).map(([subject, date]) => `${subject}: ${date}`).join('\n'));
            } catch (error) {
                bot.sendMessage(chatId, 'Failed to fetch internal tests.');
            }
            break;
        case 'semester':
            const semesterExams = examSchedule.semesterExams;
            bot.sendMessage(chatId, `Semester Exam Dates:\n` +
                Object.entries(semesterExams).map(([semester, date]) => `${semester}: ${date}`).join('\n'));
            break;
        case 'marks':
            // Implement marks retrieval logic
            bot.sendMessage(chatId, 'Fetching marks...');
            break;
        case 'attendance':
            // Implement attendance retrieval logic
            bot.sendMessage(chatId, 'Fetching attendance...');
            break;
        default:
            bot.sendMessage(chatId, 'Unknown command.');
    }
});



// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
