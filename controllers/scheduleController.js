const Schedule = require('../models/Schedule');

exports.getAllSchedules = async (req, res) => {
  try {
    if(req.admin){
      if(req.admin.role==process.env.SUPER_ADMIN)res.json(await Schedule.find({"isHide":{$exists:false}}));//get all schedule for superadmin
      else res.json( await Schedule.find({'manager._id': req.admin._id.toString(),"isHide":{$exists:false}}));//get only managed schedule for super admin
    }else if(req.params.id)res.json( await Schedule.find({'event._id':req.params.id,"isHide":{$exists:false}}));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.createSchedule = async (req, res) => {
  try {
    req.admin._id=req.admin._id.toString();
    req.body.manager=req.admin
    const schedule = new Schedule(req.body);
    const savedSchedule = await schedule.save();
    res.status(201).json({_id: savedSchedule._id.toString()});
  } catch (error) {
    if (error.name === 'ValidationError') {
      let errors = [];
      Object.keys(error.errors).forEach((key) => {errors.push(key.split('.')[1])});
      res.status(401).json(errors);
    }else res.status(500).json({ message: err.message  });
  }
};
exports.deleteSchedule = async (req, res) => {
  try {
    await Schedule.findByIdAndDelete(req.params.id);
    res.json({ message: 'Invité supprimé' });
  } catch (error) {
    console.error('Delete schedule error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
exports.updateSchedule = async (req, res) => {
  try {
    if(req.body._id)delete req.body._id; // Supprimer l'ID pour éviter les conflits
    const updatedSchedule = await Schedule.findByIdAndUpdate( req.params.id,req.body);
    if (!updatedSchedule) return res.status(404).json({ error: 'Cadeau non trouvé' });
    
    res.status(200).json({_id: updatedSchedule._id.toString()});
  } catch (error) {
    console.log(error);
    
    if (error.name === 'ValidationError') {
      let errors = [];
      Object.keys(error.errors).forEach((key) => {errors.push(key.split('.')[1])});
      res.status(401).json(errors);
    }else res.status(500).json({ message: 'Erreur serveur' });}

};