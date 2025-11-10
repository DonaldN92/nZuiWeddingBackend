const Question = require('../models/Question');

exports.getAllQuestions = async (req, res) => {
  try {
    if(req.admin){
      if(req.admin.role==process.env.SUPER_ADMIN)res.json(await Question.find({"isHide":{$exists:false}}));//get all question for superadmin
      else res.json( await Question.find({'manager._id': req.admin._id.toString(),"isHide":{$exists:false}}));//get only managed question for super admin
    }else if(req.params.id)res.json( await Question.find({'event._id':req.params.id,"isHide":{$exists:false}}));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.createQuestion = async (req, res) => {
  try {
    req.admin._id=req.admin._id.toString();
    req.body.manager=req.admin
    const question = new Question(req.body);
    const savedQuestion = await question.save();
    res.status(201).json({_id: savedQuestion._id.toString()});
  } catch (error) {
    if (error.name === 'ValidationError') {
      let errors = [];
      Object.keys(error.errors).forEach((key) => {errors.push(key.split('.')[1])});
      res.status(401).json(errors);
    }else res.status(500).json({ message: err.message  });
  }
};
exports.deleteQuestion = async (req, res) => {
  try {
    await Question.findByIdAndDelete(req.params.id);
    res.json({ message: 'Question supprimé' });
  } catch (error) {
    console.error('Delete question error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
exports.updateQuestion = async (req, res) => {
  try {
    if(req.body._id)delete req.body._id; // Supprimer l'ID pour éviter les conflits
    const updatedQuestion = await Question.findByIdAndUpdate( req.params.id,req.body);
    if (!updatedQuestion) return res.status(404).json({ error: 'Question non trouvé' });
    
    res.status(200).json({_id: updatedQuestion._id.toString()});
  } catch (error) {
    console.log(error);
    
    if (error.name === 'ValidationError') {
      let errors = [];
      Object.keys(error.errors).forEach((key) => {errors.push(key.split('.')[1])});
      res.status(401).json(errors);
    }else res.status(500).json({ message: 'Erreur serveur' });}

};