const Guest = require('../models/Guest');
const Event = require('../models/Event');

exports.getAllGuests = async (req, res) => {
  try {
      if(req.admin.role==process.env.SUPER_ADMIN)res.json(await Guest.find({"isHide":{$exists:false}}));//get all guest for superadmin
      else res.json( await Guest.find({'manager._id': req.admin._id.toString(),"isHide":{$exists:false}}));//get only managed guest for super admin
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.createGuest = async (req, res) => {
  try {
    if(req.admin){
      req.admin._id=req.admin._id.toString();
      req.body.manager=req.admin
    }else{
      let event=  await Event.findById(req.body.event._id)
      req.body.event.title=event.general.title
      req.body.manager=event.manager
    }
    const guest = new Guest(req.body);
    const savedGuest = await guest.save();
    res.status(201).json({_id: savedGuest._id.toString()});
  } catch (error) {
    if (error.name === 'ValidationError') {
      let errors = [];
      Object.keys(error.errors).forEach((key) => {errors.push(key.split('.')[1])});
      res.status(401).json(errors);
    }else res.status(500).json({ message: err.message  });
  }
};
exports.deleteGuest = async (req, res) => {
  try {
    await Guest.findByIdAndDelete(req.params.id);
    res.json({ message: 'Invité supprimé' });
  } catch (error) {
    console.error('Delete guest error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
exports.updateGuest = async (req, res) => {
  try {
    if(req.body._id)delete req.body._id; // Supprimer l'ID pour éviter les conflits
    const updatedGuest = await Guest.findByIdAndUpdate( req.params.id,req.body);
    if (!updatedGuest) return res.status(404).json({ error: 'Invité non trouvé' });
    
    res.status(200).json({_id: updatedGuest._id.toString()});
  } catch (error) {
    console.log(error);
    
    if (error.name === 'ValidationError') {
      let errors = [];
      Object.keys(error.errors).forEach((key) => {errors.push(key.split('.')[1])});
      res.status(401).json(errors);
    }else res.status(500).json({ message: 'Erreur serveur' });}

};
exports.sendInvitation = async (req, res) => {
  try {
    const updatedGuest = await Guest.findByIdAndUpdate( req.params.id,{invitationSent:true});
    if (!updatedGuest) return res.status(404).json({ error: 'Invité non trouvé' });
    
    res.status(200).json({_id: updatedGuest._id.toString()});
  } catch (error) {
    console.log(error);
    
    if (error.name === 'ValidationError') {
      let errors = [];
      Object.keys(error.errors).forEach((key) => {errors.push(key.split('.')[1])});
      res.status(401).json(errors);
    }else res.status(500).json({ message: 'Erreur serveur' });}

};