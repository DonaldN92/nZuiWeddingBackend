const winston = require('winston');
const { combine, timestamp, printf, colorize, align } = winston.format;
const path = require('path');
const fs = require('fs');

// 1. Déclarer logDir avant son utilisation
const logDir = 'logs'; // Définition de la variable

// Vérifier/Créer le dossier logs
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Format personnalisé
const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

// Configuration des transports
const transports = [
  new winston.transports.File({
    filename: path.join(logDir, 'error.log'),
    level: 'error'
  }),
  new winston.transports.File({
    filename: path.join(logDir, 'combined.log')
  })
];

// Ajout du transport console en développement
if (process.env.NODE_ENV !== 'production') {
  transports.push(new winston.transports.Console({
    format: combine(
      colorize(),
      timestamp(),
      align(),
      logFormat
    )
  }));
}

// Création du logger
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    logFormat
  ),
  transports: transports,
  exceptionHandlers: [
    new winston.transports.File({ 
      filename: path.join(logDir, 'exceptions.log') 
    })
  ]
});

// Middleware pour logger les requêtes HTTP
logger.logRequests = (req, res, next) => {
  logger.info(`Requête: ${req.method} ${req.originalUrl}`);
  next();
};

module.exports = logger;