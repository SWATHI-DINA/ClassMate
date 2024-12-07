const express = require('express');
const app = express();
const port = 4000; // Ensure this matches the port used in your bot

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

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://127.0.0.1:${port}`);
});
