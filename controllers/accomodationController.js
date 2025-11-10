const Accomodation = require('../models/Accomodation');

exports.getAllAccomodation = async (req, res) => {
  try {
    if(req.admin){
      if(req.admin.role==process.env.SUPER_ADMIN)res.json(await Accomodation.find({"isHide":{$exists:false}}));//get all accomodation for superadmin
      else res.json( await Accomodation.find({'manager._id': req.admin._id.toString(),"isHide":{$exists:false}}));//get only managed accomodation for super admin
    }
    else if(req.params.id)res.json( await Accomodation.find({'event._id':req.params.id,"isHide":{$exists:false}}));
    } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.createAccomodation = async (req, res) => {
  try {
    req.admin._id=req.admin._id.toString();
    req.body.manager=req.admin
    const accomodation = new Accomodation(req.body);
    const savedAccomodation = await accomodation.save();
    res.status(201).json({_id: savedAccomodation._id.toString()});
  } catch (error) {
    if (error.name === 'ValidationError') {
      let errors = [];
      Object.keys(error.errors).forEach((key) => {errors.push(key.split('.')[1])});
      res.status(401).json(errors);
    }else res.status(500).json({ message: err.message  });
  }
};
exports.deleteAccomodation = async (req, res) => {
  try {
    await Accomodation.findByIdAndDelete(req.params.id);
    res.json({ message: 'Hebergement supprimée' });
  } catch (error) {
    console.error('Delete accomodation error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
exports.updateAccomodation = async (req, res) => {
  try {
    if(req.body._id)delete req.body._id; // Supprimer l'ID pour éviter les conflits
    const updatedAccomodation = await Accomodation.findByIdAndUpdate( req.params.id,req.body);
    if (!updatedAccomodation) return res.status(404).json({ error: 'Hebergement non trouvée' });
    
    res.status(200).json({_id: updatedAccomodation._id.toString()});
  } catch (error) {
    console.log(error);
    
    if (error.name === 'ValidationError') {
      let errors = [];
      Object.keys(error.errors).forEach((key) => {errors.push(key.split('.')[1])});
      res.status(401).json(errors);
    }else res.status(500).json({ message: 'Erreur serveur' });}

};