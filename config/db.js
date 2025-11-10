const mongoose = require('mongoose');
const logger = require('../utils/logger');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    });
    logger.info('MongoDB connecté avec succès');
  } catch (err) {
    logger.error(`Erreur de connexion MongoDB: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;