require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
var https = require('https')
var fs = require('fs')
const logger = require('./utils/logger');
const startMonitoring = require('./utils/monitoring');
const startBackupScheduler = require('./utils/backupScheduler');
const app = express();
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));
// Validation des variables d'environnement requises
const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET', 'PORT'];

requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    logger.error(`ERREUR: La variable ${envVar} est manquante dans .env`);
    process.exit(1);
  }
}); 
// Configuration du port
const PORT = process.env.PORT;

// Connexion DB
mongoose.connect(`${process.env.MONGODB_URI}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName:process.env.DB_NAME
})
.then(() => logger.info('Connected to MongoDB'))
.catch(err => logger.error('MongoDB connection error:', err));


// Middlewares
app.use([
  cors({origin: process.env.FRONTEND_DOMAIN.split(','),credentials: true}),
  express.json(),
  express.urlencoded({ extended: true }),
]);
app.use(logger.logRequests);
// Routes
app.use('/api/guests', require('./routes/guestRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/event', require('./routes/eventRoutes'));
app.use('/api/media', require('./routes/mediaRoutes'));
app.use('/api/gallery', require('./routes/galleryRoutes'));
app.use('/api/gift', require('./routes/giftRoutes'));
app.use('/api/schedule', require('./routes/scheduleRoutes'));
app.use('/api/message', require('./routes/messageRoutes'));
app.use('/api/accomodation', require('./routes/accomodationRoutes'));
app.use('/api/faq', require('./routes/faqRoutes'));
app.use('/api/timeline', require('./routes/timelineRoutes'));
app.use('/api/survey', require('./routes/surveyRoutes'));
app.use('/api/story', require('./routes/ourStoryRoutes'));
app.use('/api/quiz', require('./routes/quizRoutes'));

// Route 404
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route non trouvée' });
});

// Démarrer les services en production
if (process.env.NODE_ENV === 'production') {
  startMonitoring();
  startBackupScheduler();
}

// Config du HTTPS & Démarrage du serveur 
const server =https.createServer({
  key: fs.readFileSync('/etc/letsencrypt/live/server.nzui.tech/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/server.nzui.tech/cert.pem'),
  ca: fs.readFileSync('/etc/letsencrypt/live/server.nzui.tech/chain.pem')
}, app)

server.listen(PORT, function () {
    console.log(`🚀 Server started on port ${PORT}`);
    console.log(`🔐 Mode: ${process.env.NODE_ENV}`);
})


// Gestion des erreurs non catchées
process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  logger.error(err.name, err.message);
  logger.error(err);
  process.exit(1);
});

// Gestion des erreurs non gérées (promesses rejetées)
process.on('unhandledRejection', (err) => {
  logger.error('UNHANDLED REJECTION! 💥 Shutting down...');
  logger.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Gestion du signal SIGTERM (pour les déploiements)
process.on('SIGTERM', () => {
  logger.info('👋 SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    logger.info('💥 Process terminated!');
  });
});
process.on('SIGINT', () => {
  logger.info('Arrêt du serveur...');
  process.exit(0);
});

module.exports = app;