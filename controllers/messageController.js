const BulkMessage = require('../models/BulkMessage');
const Message = require('../models/Message');
const Guest = require('../models/Guest');
const Event = require('../models/Event');
const manageEmail = require('../utils/email');

exports.getAllMessages = async (req, res) => {
  try {
    if(req.event){
      if(req.event.role==process.env.SUPER_ADMIN)res.json(await Message.find({"isHide":{$exists:false}}));//get all message for superadmin
      else {
        res.json( await Message.find({'event._id': req.event._id.toString(),"isHide":{$exists:false}}));//get only managed message this admin
      }
    }
    else if(req.query.event_id)res.json( await Message.find({'event._id': req.query.event_id,"isHide":{$exists:false}}));
    else if(req.params.id)res.json( await Message.find({'event._id': req.params.id,"status":'approved',"isHide":{$exists:false}}));
  } catch (err) {
    console.log("err",err);
    
    res.status(500).json({ message: err.message });
  }
};
exports.createMessage = async (req, res) => {
  try {
    const message = new Message(req.body);
    const savedMessage = await message.save();
    
    let event=  await Event.findById(req.body.event._id)
    manageEmail.sendEmail(Buffer.from(event.manager.email,'base64').toString('utf8'),
      {
        contact:req.body.author.contact,
        name:req.body.author.name,
        message:req.body.message,
        refuseLink:`${process.env.SERVER_URL}api/message/deny/${event._id.toString()}/${savedMessage._id.toString()}`,
        validLink:`${process.env.SERVER_URL}api/message/allow/${event._id.toString()}/${savedMessage._id.toString()}`
      },
      "newMessage")
    res.status(201).json({_id: savedMessage._id.toString()});
  } catch (error) {
    if (error.name === 'ValidationError') {
      let errors = [];
      Object.keys(error.errors).forEach((key) => {errors.push(key.split('.')[1])});
      res.status(401).json(errors);
    }else res.status(500).json({ message: error.message  });
  }
};
exports.sendBulkMessage = async (req, res) => {
  try {
    req.admin._id=req.admin._id.toString();
    req.body.manager=req.admin
    
    let recipients=res.json( await Guest.find({'event._id': req.event._id.toString(),"isHide":{$exists:false}}));
    if(req.body.recipients=="confirmed")recipients=recipients.filter(o=>o.isAttending==true)
    else if(req.body.recipients=="notResponded")recipients=recipients.filter(o=>o.responded==false)
    
    let event=  await Event.findById(req.body.event._id)
    req.body.event.title=event.general.title
    req.body.manager=event.manager

    req.body.listRecipients=""
    for (let i = 0; i < recipients.length; i++) {
      if(recipients[i].email){
        req.body.listRecipients=","+Buffer.from(recipients[i].email,'base64').toString('utf8')
        manageEmail.sendEmail( Buffer.from(recipients[i].email,'base64').toString('utf8'),
          {
            contact:req.body.eventTitle,
            name:req.body.subject,
            message:req.body.message
          },
          "newMessage"
        )
      }
    }
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