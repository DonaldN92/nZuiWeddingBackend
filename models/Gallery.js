const mongoose = require('mongoose');

const GallerySchema = new mongoose.Schema({
  event:{
    _id:  {type: String,  required: true},
    title:{type: String,  required: true}
  },
  manager:{
      _id:    {type: String,      required: true},
      name:     {type: String,    required: true},
      email:    {type: String,    required: true}
  },
  category: {type: String},
  caption:  {type: String},
}, { timestamps: true });

module.exports = mongoose.model('Gallery', GallerySchema);