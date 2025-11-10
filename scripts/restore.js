const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const logger = require('../utils/logger');
const readline = require('readline');

const DB_NAME = 'weddingDB';
const BACKUP_DIR = path.join(__dirname, '../backups');
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';

// Lister les backups disponibles
const backups = fs.readdirSync(BACKUP_DIR)
  .filter(file => file.startsWith('backup-') && file.endsWith('.tar.gz'))
  .sort()
  .reverse();

if (backups.length === 0) {
  logger.error('Aucun backup disponible');
  process.exit(1);
}

// Interface pour choisir le backup
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('Backups disponibles:');
backups.forEach((backup, index) => {
  console.log(`${index + 1}. ${backup}`);
});

rl.question('Choisissez un backup à restaurer (numéro): ', (answer) => {
  const selectedIndex = parseInt(answer) - 1;
  
  if (isNaN(selectedIndex) || selectedIndex < 0 || selectedIndex >= backups.length) {
    logger.error('Choix invalide');
    process.exit(1);
  }
  
  const selectedBackup = backups[selectedIndex];
  const backupPath = path.join(BACKUP_DIR, selectedBackup);
  const tempDir = path.join(BACKUP_DIR, 'temp_restore');
  
  // Décompresser le backup
  logger.info(`Décompression de ${selectedBackup}...`);
  exec(`tar -xzvf ${backupPath} -C ${BACKUP_DIR}`, (error) => {
    if (error) {
      logger.error('Erreur lors de la décompression', { error: error.message });
      process.exit(1);
    }
    
    // Restaurer la base de données
    const cmd = `mongorestore --uri="${MONGODB_URI}" --drop ${path.join(BACKUP_DIR, selectedBackup.replace('.tar.gz', ''), DB_NAME}`;
    
    logger.info(`Restauration avec la commande: ${cmd}`);
    exec(cmd, (restoreError, stdout, stderr) => {
      // Nettoyage
      fs.rmSync(path.join(BACKUP_DIR, selectedBackup.replace('.tar.gz', '')), { recursive: true, force: true });
      
      if (restoreError) {
        logger.error('Erreur lors de la restauration', { error: restoreError.message });
        process.exit(1);
      }
      
      logger.info('Restauration terminée avec succès!');
      process.exit(0);
    });
  });
});