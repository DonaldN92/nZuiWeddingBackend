const Step = require('../models/StepStory');
const {saveImg,deleteImg} = require('../utils/helper');

const createStep = async (req, res) => {
  try {
    //Save base64 images
    if(req.body.image){
        var image = req.body.image;
        req.body.hasImage = true;
    }

    req.admin._id=req.admin._id.toString();
    req.body.manager=req.admin
    
    const step = await Step.create(req.body);
    
    if(image) saveImg(image,`step_${req.body.event._id}_${step._id}`);

    res.status(200).json({_id: step._id.toString()});
  } catch (error) {
    if (error.name === 'ValidationError') {
      let errors = [];
      Object.keys(error.errors).forEach((key) => {errors.push(key.split('.')[1])});
      res.status(401).json(errors);
    }else res.status(500).json({ message: 'Erreur serveur' });}
};
const getAllSteps = async (req, res) => {
  try {
    if(req.admin){
      if(req.admin.role==process.env.SUPER_ADMIN)res.json(await Step.find({"isHide":{$exists:false}}));//get all steps for superadmin
      else res.json( await Step.find({'manager._id': req.admin._id.toString(),"isHide":{$exists:false}}));//get only managed steps for admin
    }else if(req.params.id)res.json( await Step.find({'event._id': req.params.id,"isHide":{$exists:false}}));
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

const deleteStep = async (req, res) => {
  try {
    let step =await Step.findByIdAndDelete(req.params.id);
    res.json({ message: 'Etape supprimée' });
    deleteImg(`step_${step.event._id}_${req.params.id.toString()}`)
  } catch (error) {
    console.error('Delete step error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
const updateStep = async (req, res) => {   
  try {
    if(req.body._id)delete req.body._id; // Supprimer l'ID pour éviter les conflits
    
    //Save base64 images
    if(req.body.image){
        var image = req.body.image;
        req.body.hasImage = true;
    }

    req.admin._id=req.admin._id.toString();
    req.body.manager=req.admin
    
    const step = await Step.findByIdAndUpdate(
        req.params.id,
        req.body
    );
    if (!step) return res.status(404).json({ error: 'Etape non trouvé' });
    
    if(image) saveImg(image,`step_${req.body.event._id}_${step._id}`);

    res.status(200).json({_id: step._id.toString()});
  } catch (error) {
    if (error.name === 'ValidationError') {
      let errors = [];
      Object.keys(error.errors).forEach((key) => {errors.push(key.split('.')[1])});
      res.status(401).json(errors);
    }else res.status(500).json({ message: 'Erreur serveur' });}

};


module.exports = {
  createStep,
  updateStep,
  getAllSteps,
  deleteStep
};