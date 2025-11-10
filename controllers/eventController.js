const Event = require('../models/Event');

const {saveImg,deleteImg} = require('../utils/helper');

// @desc    Enregistrer un nouvel event
// @route   POST /api/event
// @access  admin
const addEvent = async (req, res) => {
  try {
    //Save base64 images
    if(req.body.presentation.initialPresentationImg1){
        var initialPresentationImg1 = req.body.presentation.initialPresentationImg1;
        req.body.presentation.initialPresentationImg1 = true;
    }
    if(req.body.presentation.initialPresentationImg2){
        var initialPresentationImg2 = req.body.presentation.initialPresentationImg2;
        req.body.presentation.initialPresentationImg2 = true;
    }
    if(req.body.speaker.initialPersonImg1){
        var initialPersonImg1 = req.body.speaker.initialPersonImg1;
        req.body.speaker.initialPersonImg1= true;
    }
    if(req.body.speaker.initialPersonImg2){
        var initialPersonImg2 = req.body.speaker.initialPersonImg2;
        req.body.speaker.initialPersonImg2 = true;
    }
    if(req.body.galerie.initialGallery1){
        var initialGallery1 = req.body.galerie.initialGallery1;
        req.body.galerie.initialGallery1 = true;
    }
    if(req.body.galerie.initialGallery2){
        var initialGallery2 = req.body.galerie.initialGallery2;
        req.body.galerie.initialGallery2 = true;
    }
    if(req.body.galerie.initialGallery3){
        var initialGallery3 = req.body.galerie.initialGallery3;
        req.body.galerie.initialGallery3 = true;
    }   
    if(req.body.galerie.initialGallery4){
        var initialGallery4 = req.body.galerie.initialGallery4;
        req.body.galerie.initialGallery4 = true;
    }
    if(req.body.galerie.initialGallery5){
        var initialGallery5 = req.body.galerie.initialGallery5;
        req.body.galerie.initialGallery5 = true;
    }
    if(req.body.galerie.initialGallery6){ 
        var initialGallery6 = req.body.galerie.initialGallery6;
        req.body.galerie.initialGallery6 = true;
    }

    req.admin._id=req.admin._id.toString();
    req.body.manager=req.admin
    
    
    const event = await Event.create(req.body);
    
    if(initialPresentationImg1)saveImg(initialPresentationImg1,`event_presentationImg1_${event._id}`);
    if(initialPresentationImg2)saveImg(initialPresentationImg2,`event_presentationImg2_${event._id}`);

    if(initialPersonImg1)saveImg(initialPersonImg1,`event_speakerImg1_${event._id}`);
    if(initialPersonImg2)saveImg(initialPersonImg2,`event_speakerImg2_${event._id}`);

    if(initialGallery1) saveImg(initialGallery1,`event_gallery1_${event._id}`);
    if(initialGallery2) saveImg(initialGallery2,`event_gallery2_${event._id}`);
    if(initialGallery3) saveImg(initialGallery3,`event_gallery3_${event._id}`);
    if(initialGallery4) saveImg(initialGallery4,`event_gallery4_${event._id}`);
    if(initialGallery5) saveImg(initialGallery5,`event_gallery5_${event._id}`);
    if(initialGallery6) saveImg(initialGallery6,`event_gallery6_${event._id}`);

    res.status(200).json({_id: event._id.toString()});
  } catch (error) {
    if (error.name === 'ValidationError') {
      let errors = [];
      Object.keys(error.errors).forEach((key) => {errors.push(key.split('.')[1])});
      res.status(401).json(errors);
    }else res.status(500).json({ message: 'Erreur serveur' });}
};

// @desc    Obtenir tous les events
// @route   GET /api/event
// @access  admin
const getEvents = async (req, res) => {
  try {
    if(req.admin){
      if(req.admin.role==process.env.SUPER_ADMIN)res.json(await Event.find({"isHide":{$exists:false}}));//get all events for superadmin
      else res.json( await Event.find({'manager._id': req.admin._id.toString(),"isHide":{$exists:false}}));//get only managed events for admin
    }else if(req.params.id){
      let response=await Event.findById(req.params.id)
      delete response._v
      delete response.survey
      delete response.createdAt
      delete response.manager._id
      res.status(200).json(response);
    }
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// @desc    Supprimer un event
// @route   DELETE /api/event/:id
// @access  admin
const deleteEvent = async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);

    deleteImg(`event_presentationImg1_${req.params.id.toString()}`)
    deleteImg(`event_presentationImg2_${req.params.id.toString()}`)

    deleteImg(`event_speakerImg1_${req.params.id.toString()}`)
    deleteImg(`event_speakerImg2_${req.params.id.toString()}`)

    deleteImg(`event_gallery1_${req.params.id.toString()}`)
    deleteImg(`event_gallery2_${req.params.id.toString()}`)
    deleteImg(`event_gallery3_${req.params.id.toString()}`)
    deleteImg(`event_gallery4_${req.params.id.toString()}`)
    deleteImg(`event_gallery5_${req.params.id.toString()}`)
    deleteImg(`event_gallery6_${req.params.id.toString()}`)

    res.json({ message: 'Event supprimé' });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// @desc    update a user
// @route   PATCH /api/event/:id
// @access  admin
const updateEvent = async (req, res) => {
    
  try {
    if(req.body._id)delete req.body._id; // Supprimer l'ID pour éviter les conflits
    
    //Save base64 images
    if(req.body.presentation.initialPresentationImg1){
        var initialPresentationImg1 = req.body.presentation.initialPresentationImg1;
        req.body.presentation.initialPresentationImg1 = true;
    }
    if(req.body.presentation.initialPresentationImg2){
        var initialPresentationImg2 = req.body.presentation.initialPresentationImg2;
        req.body.presentation.initialPresentationImg2 = true;
    }
    if(req.body.speaker.initialPersonImg1){
        var initialPersonImg1 = req.body.speaker.initialPersonImg1;
        req.body.speaker.initialPersonImg1= true;
    }
    if(req.body.speaker.initialPersonImg2){
        var initialPersonImg2 = req.body.speaker.initialPersonImg2;
        req.body.speaker.initialPersonImg2 = true;
    }
    if(req.body.galerie.initialGallery1){
        var initialGallery1 = req.body.galerie.initialGallery1;
        req.body.galerie.initialGallery1 = true;
    }
    if(req.body.galerie.initialGallery2){
        var initialGallery2 = req.body.galerie.initialGallery2;
        req.body.galerie.initialGallery2 = true;
    }
    if(req.body.galerie.initialGallery3){
        var initialGallery3 = req.body.galerie.initialGallery3;
        req.body.galerie.initialGallery3 = true;
    }   
    if(req.body.galerie.initialGallery4){
        var initialGallery4 = req.body.galerie.initialGallery4;
        req.body.galerie.initialGallery4 = true;
    }
    if(req.body.galerie.initialGallery5){
        var initialGallery5 = req.body.galerie.initialGallery5;
        req.body.galerie.initialGallery5 = true;
    }
    if(req.body.galerie.initialGallery6){ 
        var initialGallery6 = req.body.galerie.initialGallery6;
        req.body.galerie.initialGallery6 = true;
    }

    req.admin._id=req.admin._id.toString();
    req.body.manager=req.admin
    
    
    const event = await Event.findByIdAndUpdate(
        req.params.id,
        req.body
    );
    if (!event) return res.status(404).json({ error: 'Evenement non trouvé' });
    
    if(initialPresentationImg1)saveImg(initialPresentationImg1,`event_presentationImg1_${event._id}`);
    if(initialPresentationImg2)saveImg(initialPresentationImg2,`event_presentationImg2_${event._id}`);

    if(initialPersonImg1)saveImg(initialPersonImg1,`event_speakerImg1_${event._id}`);
    if(initialPersonImg2)saveImg(initialPersonImg2,`event_speakerImg2_${event._id}`);

    if(initialGallery1) saveImg(initialGallery1,`event_gallery1_${event._id}`);
    if(initialGallery2) saveImg(initialGallery2,`event_gallery2_${event._id}`);
    if(initialGallery3) saveImg(initialGallery3,`event_gallery3_${event._id}`);
    if(initialGallery4) saveImg(initialGallery4,`event_gallery4_${event._id}`);
    if(initialGallery5) saveImg(initialGallery5,`event_gallery5_${event._id}`);
    if(initialGallery6) saveImg(initialGallery6,`event_gallery6_${event._id}`);

    res.status(200).json({_id: event._id.toString()});
  } catch (error) {
    console.log(error);
    
    if (error.name === 'ValidationError') {
      let errors = [];
      Object.keys(error.errors).forEach((key) => {errors.push(key.split('.')[1])});
      res.status(401).json(errors);
    }else res.status(500).json({ message: 'Erreur serveur' });}

};


module.exports = {
  addEvent,
  getEvents,
  deleteEvent,
  updateEvent
};