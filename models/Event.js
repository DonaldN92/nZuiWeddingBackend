const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    manager:{
        _id:    {type: String,      required: true},
        name:     {type: String,    required: true},
        email:    {type: String,    required: true}
    },
    general: {
        theme:    {type: String,  required: true, enum: ['wedding','bithday','funeral','event']},
        template: {type: String,  required: true},
        title:    {type: String,  required: true},
        date:     {type: Date,    required: true},
        place:    {type: String,  required: true},
        welcomeMessage:   {type: String},
        mainContacts:     {type: String},
        googleMap:        {type: String},
        welcomeMessage:   {type: String},
    },
    presentation:{
        initialPresentationImg1: {type: Boolean,    default: false},
        initialPresentationImg2: {type: Boolean,    default: false},
        presentation: {type: String},
        newRSVP:      {type: Boolean,  default: true},
        newMessage:   {type: Boolean,  default: true},
        giftReserved: {type: Boolean,  default: true},
        emailNotifications:   {type: Boolean,  default: true}
    },
    speaker:{
        initialPersonImg1:{type: Boolean,   default: false},
        titleSpeaker1:{type: String},
        nameSpeaker1: {type: String},
        bioSpeaker1:  {type: String},
        initialPersonImg2: {type: Boolean,  default: false},
        titleSpeaker2:{type: String},
        nameSpeaker2: {type: String},
        bioSpeaker2:  {type: String}
    },
    galerie:{
        initialGallery1: {type: Boolean,  default: false},
        initialGallery2: {type: Boolean,  default: false},
        initialGallery3: {type: Boolean,  default: false},
        initialGallery4: {type: Boolean,  default: false},
        initialGallery5: {type: Boolean,  default: false},
        initialGallery6: {type: Boolean,  default: false}
    },
    survey: [{
        question: String,
        choose: Number,
        address: String,
        comment: String
    }],
    isHide:   {type: Boolean},
    state:    {type: String,enum: ['actif', 'inactif'],default: 'actif'},
    createdAt:{type: Date, default: Date.now}
});

module.exports = mongoose.model('Event', EventSchema);