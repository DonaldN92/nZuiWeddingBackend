const schedule = require('node-schedule');
const backup = require('../scripts/backup');
const logger = require('./logger');

// Planifier un backup quotidien à 2h du matin
const startBackupScheduler = () => {
  schedule.scheduleJob('0 2 * * *', () => {
    logger.info('Lancement du backup planifié');
    backup();
  });
  
  logger.info('Planificateur de backup initialisé');
};

module.exports = startBackupScheduler;