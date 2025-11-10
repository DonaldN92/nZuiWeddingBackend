const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const logger = require('../utils/logger');
const moment = require('moment');
require("dotenv").config();

const BACKUP_DIR = path.join(__dirname, '../backups');

// Créer le dossier backups s'il n'existe pas
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR);
}

const currentDate = moment().format('YYYY-MM-DD_HH-mm-ss');
const backupPath = path.join(BACKUP_DIR, `backup-${currentDate}`);

// Commande mongodump
const cmd = `mongodump --uri="${process.env.MONGODB_URI}/${process.env.DB_NAME}" --out=${backupPath}`;

//logger.info(`Lancement du backup: ${cmd}`);
//mongodump --uri="mongodb://nZui:nZu1_WS@localhost:22017/party" --out=/var/events/backend/backups/backup-2025-10-25_07-02-19
exec(cmd, (error, stdout, stderr) => {
  if (error) {
    logger.error('Erreur lors du backup', { error: error.message });
    return;
  }
  
  logger.info(`Backup réussi dans ${backupPath}`);
  
  // Compression du backup
  const compressCmd = `tar -czvf ${backupPath}.tar.gz -C ${BACKUP_DIR} backup-${currentDate}`;
  
  exec(compressCmd, (compressError) => {
    if (compressError) {
      logger.error('Erreur lors de la compression', { error: compressError.message });
      return;
    }
    
    // Suppression du dossier non compressé
    fs.rmSync(backupPath, { recursive: true, force: true });
    
    logger.info(`Backup compressé: ${backupPath}.tar.gz`);
    
    // Nettoyage des vieux backups (conservation 7 jours)
    cleanOldBackups();
  });
});

function cleanOldBackups() {
  const files = fs.readdirSync(BACKUP_DIR);
  const now = new Date();
  const daysToKeep = 7;
  
  files.forEach(file => {
    if (file.startsWith('backup-') && file.endsWith('.tar.gz')) {
      const filePath = path.join(BACKUP_DIR, file);
      const stats = fs.statSync(filePath);
      const ageInDays = (now - stats.birthtime) / (1000 * 60 * 60 * 24);
      
      if (ageInDays > daysToKeep) {
        fs.unlinkSync(filePath);
        logger.info(`Backup supprimé: ${file} (${Math.floor(ageInDays)} jours)`);
      }
    }
  });
}