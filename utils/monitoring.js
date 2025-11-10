const logger = require('./logger');
const nodemailer = require('nodemailer');

// Configuration de l'email
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.ALERT_EMAIL,
    pass: process.env.ALERT_EMAIL_PASSWORD
  }
});

// Vérification de l'espace disque
function checkDiskSpace() {
  const checkDisk = require('check-disk-space');
  const threshold = 20; // 20% d'espace libre minimum
  
  checkDisk('/').then((diskSpace) => {
    const percentFree = (diskSpace.free / diskSpace.size) * 100;
    
    if (percentFree < threshold) {
      const message = `Espace disque critique: ${Math.floor(percentFree)}% libre`;
      logger.error(message);
      sendAlert('Alerte Espace Disque', message);
    }
  });
}

// Vérification de la mémoire
function checkMemory() {
  const os = require('os');
  const threshold = 20; // 20% de mémoire libre minimum
  
  const freeMem = os.freemem() / os.totalmem() * 100;
  
  if (freeMem < threshold) {
    const message = `Mémoire critique: ${Math.floor(freeMem)}% libre`;
    logger.error(message);
    sendAlert('Alerte Mémoire', message);
  }
}

// Envoi d'alerte par email
function sendAlert(subject, message) {
  const mailOptions = {
    from: process.env.ALERT_EMAIL,
    to: process.env.ADMIN_EMAIL,
    subject: `[Wedding App] ${subject}`,
    text: message
  };
  
  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      logger.error('Erreur lors de l\'envoi de l\'alerte', { error: error.message });
    }
  });
}

// Surveillance des erreurs critiques
function setupErrorMonitoring() {
  process.on('uncaughtException', (error) => {
    logger.error('Exception non capturée', { 
      error: error.message,
      stack: error.stack 
    });
    sendAlert('Exception non capturée', error.stack);
  });
  
  process.on('unhandledRejection', (reason, promise) => {
    logger.error('Rejet non géré', { 
      reason: reason.message || reason,
      stack: reason.stack 
    });
    sendAlert('Rejet non géré', reason.stack || reason);
  });
}

// Démarrer la surveillance
function startMonitoring() {
  // Vérifications toutes les heures
  setInterval(checkDiskSpace, 60 * 60 * 1000);
  setInterval(checkMemory, 60 * 60 * 1000);
  
  // Surveillance des erreurs
  setupErrorMonitoring();
  
  logger.info('Système de surveillance initialisé');
}

module.exports = startMonitoring;