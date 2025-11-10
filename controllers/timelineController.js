const Step = require('../models/Timeline');

exports.getAllSteps = async (req, res) => {
  try {
    if(req.admin){
      if(req.admin.role==process.env.SUPER_ADMIN)res.json(await Step.find({"isHide":{$exists:false}}));//get all step for superadmin
      else res.json( await Step.find({'manager._id': req.admin._id.toString(),"isHide":{$exists:false}}));//get only managed step for super admin
    }else if(req.params.id)res.json( await Step.find({'event._id':req.params.id,"isHide":{$exists:false}}));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.createStep = async (req, res) => {
  try {
    req.admin._id=req.admin._id.toString();
    req.body.manager=req.admin
    const step = new Step(req.body);
    const savedStep = await step.save();
    res.status(201).json({_id: savedStep._id.toString()});
  } catch (error) {
    if (error.name === 'ValidationError') {
      let errors = [];
      Object.keys(error.errors).forEach((key) => {errors.push(key.split('.')[1])});
      res.status(401).json(errors);
    }else res.status(500).json({ message: err.message  });
  }
};
exports.deleteStep = async (req, res) => {
  try {
    await Step.findByIdAndDelete(req.params.id);
    res.json({ message: 'Step supprimée' });
  } catch (error) {
    console.error('Delete step error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
exports.updateStep = async (req, res) => {
  try {
    if(req.body._id)delete req.body._id; // Supprimer l'ID pour éviter les conflits
    const updatedStep = await Step.findByIdAndUpdate( req.params.id,req.body);
    if (!updatedStep) return res.status(404).json({ error: 'Step non trouvée' });
    
    res.status(200).json({_id: updatedStep._id.toString()});
  } catch (error) {
    console.log(error);
    
    if (error.name === 'ValidationError') {
      let errors = [];
      Object.keys(error.errors).forEach((key) => {errors.push(key.split('.')[1])});
      res.status(401).json(errors);
    }else res.status(500).json({ message: 'Erreur serveur' });}

};