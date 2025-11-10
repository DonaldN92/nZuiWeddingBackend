const Gift = require('../models/Gift');

exports.getAllGifts = async (req, res) => {
  try {
    if(req.admin){
      if(req.admin.role==process.env.SUPER_ADMIN)res.json(await Gift.find({"isHide":{$exists:false}}));//get all gift for superadmin
      else res.json( await Gift.find({'manager._id': req.admin._id.toString(),"isHide":{$exists:false}}));//get only managed gift for super admin
    }else if(req.params.id)res.json( await Gift.find({'event._id':req.params.id,"isHide":{$exists:false}}));
  } catch (err) {res.status(500).json({ message: err.message });}
};
exports.createGift = async (req, res) => {
  try {
    req.admin._id=req.admin._id.toString();
    req.body.manager=req.admin
    const gift = new Gift(req.body);
    const savedGift = await gift.save();
    res.status(201).json({_id: savedGift._id.toString()});
  } catch (error) {
    if (error.name === 'ValidationError') {
      let errors = [];
      Object.keys(error.errors).forEach((key) => {errors.push(key.split('.')[1])});
      res.status(401).json(errors);
    }else res.status(500).json({ message: err.message  });
  }
};
exports.deleteGift = async (req, res) => {
  try {
    await Gift.findByIdAndDelete(req.params.id);
    res.json({ message: 'Invité supprimé' });
  } catch (error) {
    console.error('Delete gift error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
exports.updateGift = async (req, res) => {
  try {
    if(req.body._id)delete req.body._id; // Supprimer l'ID pour éviter les conflits
    const updatedGift = await Gift.findByIdAndUpdate( req.params.id,req.body);
    if (!updatedGift) return res.status(404).json({ error: 'Cadeau non trouvé' });
    
    res.status(200).json({_id: updatedGift._id.toString()});
  } catch (error) {
    console.log(error);
    
    if (error.name === 'ValidationError') {
      let errors = [];
      Object.keys(error.errors).forEach((key) => {errors.push(key.split('.')[1])});
      res.status(401).json(errors);
    }else res.status(500).json({ message: 'Erreur serveur' });}

};