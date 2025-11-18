const manageEmail = require('../utils/email');
const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// @desc    Enregistrer un nouvel admin
// @route   POST /api/admin/register
// @access  SuperAdmin
const registerAdmin = async (req, res) => {
  try {
    //superadmin c3VwZXJhZG1pbg==
    const { name, email, password, role,right } = req.body;
    
    const adminExists = await Admin.findOne({ email });
    if (adminExists) return res.status(400).json({ message: 'Admin déjà existant' });
    
    /*const admin = await Admin.create({
      name,
      email,
      password,
      right,
      role: role || await Buffer.from("admin", 'utf8').toString('base64')
    });*/
    manageEmail.sendEmail(Buffer.from(email,'base64').toString('utf8'),
      {
        name: `${Buffer.from(name,'base64').toString('utf8')} (${Buffer.from(right,'base64').toString('utf8')})`,
        email:Buffer.from(email,'base64').toString('utf8'),
        password:Buffer.from(password,'base64').toString('utf8')
      },
      "newUser")
    res.status(200).json({_id: "admin._id"});
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// @desc    Authentifier un admin
// @route   POST /api/admin/login
// @access  Public
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const admin = await Admin.findOneAndUpdate(
        {email},
        { $set: { lastLogin:new Date()} }
    );
    if (!admin) return res.status(401).json({ message: 'Identifiants invalides' });
    
    const isMatch = await admin.matchPassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Identifiants invalides.' });
    

    res.json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      right: admin?.right,
      token: generateToken(admin._id)
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// @desc    Obtenir les infos de l'admin connecté
// @route   POST /api/admin/auth_me
// @access  Private
const authMeAdmin = async (req, res) => {
  try {
    const decoded = jwt.verify(req.body.token, process.env.JWT_SECRET);
    
    // Récupération de l'admin sans le mot de passe
    const admin = await Admin.findById(decoded.id).select('-password');
    res.json({
      name: admin.name,
      email: admin.email,
      role: admin.role,
      token: generateToken(admin._id)
    });
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
// @desc    Obtenir tous les admins
// @route   GET /api/admin
// @access  SuperAdmin
const getAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().select('-password');
    res.json(admins);
  } catch (error) {
    console.error('Get admins error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// @desc    Supprimer un admin
// @route   DELETE /api/admin/:id
// @access  SuperAdmin
const deleteAdmin = async (req, res) => {
  try {
    // Empêche la suppression de soi-même
    if (req.admin._id.toString() === req.params.id) {
      return res.status(400).json({ message: 'Vous ne pouvez pas vous supprimer vous-même' });
    }
    
    await Admin.findByIdAndDelete(req.params.id);
    res.json({ message: 'Admin supprimé' });
  } catch (error) {
    console.error('Delete admin error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// @desc    update a user
// @route   POST /api/admin/users/:id
// @access  SuperAdmin
const updateAdmin = async (req, res) => {
  try {
    if(req.body.password){
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
    }else { delete req.body.password;}

    const admin = await Admin.findByIdAndUpdate(
        req.params.id,
        req.body
    );
    if (!admin) 
        return res.status(404).json({ error: 'User non trouvé' });
    
    res.json({
        success: true,
        message: 'Utilisateur mis à jour avec succès',
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Génère un JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

module.exports = {
  registerAdmin,
  updateAdmin,
  loginAdmin,
  getAdmins,
  authMeAdmin,
  deleteAdmin
};