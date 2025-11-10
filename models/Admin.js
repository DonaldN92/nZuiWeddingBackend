const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const AdminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: [
      'YWRtaW4=', // 'admin' encodé en base64
      'c3VwZXJhZG1pbg=='], // 'superadmin' encodé en base64
    default: 'YWRtaW4='
  },
  state: {
    type: String,
    enum: [
      'QWN0aWY=', // Actif
      'SW5hY3RpZg=='], // Inactif
    default: 'QWN0aWY='
  },
  right: {
    type: String,
    enum: [
      'YmFzaWM=', // basic
      'Y2xhc3NpYw==',// classic
      'cHJlbWl1bQ==',// premium
      'ZWxpdGU='// elite
    ]
  },
  lastLogin: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash du mot de passe avant sauvegarde
AdminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Méthode pour comparer les mots de passe
AdminSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Admin', AdminSchema);