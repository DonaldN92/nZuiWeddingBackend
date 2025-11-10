const Gallery = require('../models/Gallery');
const {saveImg,deleteImg} = require('../utils/helper');

const uploadImage = async (req, res) => {
  try {
    req.admin._id=req.admin._id.toString();
    req.body.manager=req.admin

    const base64Img=req.body.file
    delete req.body.file

    const img = await Gallery.create(req.body);
    saveImg(base64Img,`img_${req.body.event._id}_${img._id.toString()}`);//Save base64 images

    res.status(200).json({_id: img._id.toString()});
  } catch (error) {
    if (error.name === 'ValidationError') {
      let errors = [];
      Object.keys(error.errors).forEach((key) => {errors.push(key.split('.')[1])});
      res.status(401).json(errors);
    }else res.status(500).json({ message: 'Erreur serveur' });}
};
const getAllImages = async (req, res) => {
  try {
    if(req.admin){
      if(req.admin.role==process.env.SUPER_ADMIN)res.json(await Gallery.find({"isHide":{$exists:false}}));//get all events for superadmin
      else res.json( await Gallery.find({'manager._id': req.admin._id.toString(),"isHide":{$exists:false}}));//get only managed events for admin
    }else if(req.params.id){
       res.json( await Gallery.find({'event._id': req.params.id,"isHide":{$exists:false}}));
    }
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
const deleteImage = async (req, res) => {
  try {
    let step =await Gallery.findByIdAndDelete(req.params.id);
    deleteImg(`img_${step.event._id}_${req.params.id.toString()}`)
    res.json({ message: 'Img supprimé' });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
const updateImage = async (req, res) => {
  try {
    saveImg(req.body.file,`img_${req.body.event._id}_${req.body._id}`);

    if(req.body._id)delete req.body._id; // Supprimer l'ID pour éviter les conflits
    delete req.body.file

    const img = await Gallery.findByIdAndUpdate(req.params.id,req.body);
    if (!img) return res.status(404).json({ error: 'Image non trouvé' });

    res.status(200).json({_id: img._id.toString()});
  } catch (error) {
    console.log(error);
    
    if (error.name === 'ValidationError') {
      let errors = [];
      Object.keys(error.errors).forEach((key) => {errors.push(key.split('.')[1])});
      res.status(401).json(errors);
    }else res.status(500).json({ message: 'Erreur serveur' });}

};

module.exports = {uploadImage,updateImage,getAllImages,deleteImage};