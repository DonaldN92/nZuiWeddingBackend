const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extraction du token
      token = req.headers.authorization.split(' ')[1];
      
      // Vérification du token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Récupération de l'admin sans le mot de passe
      req.admin = await Admin.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      console.error('Token error:', error);
      res.status(401).json({ message: 'Non autorisé, token invalide' });
    }
  }
  
  if (!token) {
    res.status(401).json({ message: 'Non autorisé, pas de token' });
  }
};

const isSuperAdmin = (req, res, next) => {
  if (req.admin && req.admin.role === process.env.SUPER_ADMIN) {
    next();
  } else {
    res.status(403).json({ message: 'Accès réservé aux super administrateurs' });
  }
};

module.exports = { protect, isSuperAdmin };