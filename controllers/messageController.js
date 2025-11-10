const BulkMessage = require('../models/BulkMessage');
const Message = require('../models/Message');

exports.getAllMessages = async (req, res) => {
  try {
    if(req.admin){
      if(req.admin.role==process.env.SUPER_ADMIN)res.json(await Message.find({"isHide":{$exists:false}}));//get all message for superadmin
      else res.json( await Message.find({'manager._id': req.admin._id.toString(),"isHide":{$exists:false}}));//get only managed message for super admin
    }else if(req.params.id)res.json( await Message.find({'event._id': req.params.id,"isHide":{$exists:false}}));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.createMessage = async (req, res) => {
  try {
    //req.admin._id=req.admin._id.toString();
    //req.body.manager=req.admin
    const message = new Message(req.body);
    const savedMessage = await message.save();
    res.status(201).json({_id: savedMessage._id.toString()});
  } catch (error) {
    if (error.name === 'ValidationError') {
      let errors = [];
      Object.keys(error.errors).forEach((key) => {errors.push(key.split('.')[1])});
      res.status(401).json(errors);
    }else res.status(500).json({ message: err.message  });
  }
};
exports.sendBulkMessage = async (req, res) => {
  try {
    req.admin._id=req.admin._id.toString();
    req.body.manager=req.admin
    const message = new BulkMessage(req.body);
    const savedMessage = await message.save();
    res.status(201).json({_id: savedMessage._id.toString()});
  } catch (error) {
    if (error.name === 'ValidationError') {
      let errors = [];
      Object.keys(error.errors).forEach((key) => {errors.push(key.split('.')[1])});
      res.status(401).json(errors);
    }else res.status(500).json({ message: err.message  });
  }
};
exports.deleteMessage = async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.json({ message: 'Message supprimé' });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
exports.updateMessage = async (req, res) => {
  try {
    if(req.body._id)delete req.body._id; // Supprimer l'ID pour éviter les conflits
    const updatedMessage = await Message.findByIdAndUpdate( req.params.id,req.body);
    if (!updatedMessage) return res.status(404).json({ error: 'Message non trouvé' });
    
    res.status(200).json({_id: updatedMessage._id.toString()});
  } catch (error) {
    console.log(error);
    
    if (error.name === 'ValidationError') {
      let errors = [];
      Object.keys(error.errors).forEach((key) => {errors.push(key.split('.')[1])});
      res.status(401).json(errors);
    }else res.status(500).json({ message: 'Erreur serveur' });}

};