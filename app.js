require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const logger = require('./utils/logger');
const startMonitoring = require('./utils/monitoring');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(logger.logRequests);

// Connexion DB
mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`, {
  useNewUrlParser: true, useUnifiedTopology: true
}).then(() => logger.info('Connected to MongoDB'))
.catch(err => logger.error('MongoDB connection error:', err));

// Routes
app.use('/api/guests',require('./routes/guestRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/event', require('./routes/eventRoutes'));
app.use('/api/accomodation', require('./routes/accomodationRoutes'));
app.use('/api/faq', require('./routes/faqRoutes'));
app.use('/api/timeline', require('./routes/timelineRoutes'));
app.use('/api/suvey', require('./routes/surveyRoutes'));
app.use('/api/story', require('./routes/ourStoryRoutes'));
app.use('/api/quiz', require('./routes/quizRoutes'));

// Démarrer la surveillance en production
if (process.env.NODE_ENV === 'production') {
  startMonitoring();
}

module.exports = app;