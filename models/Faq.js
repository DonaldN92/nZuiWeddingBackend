const mongoose = require('mongoose');

const FaqSchema = new mongoose.Schema({
  event:{
    _id:  {type: String,  required: true},
    title:{type: String,  required: true}
  },
  manager:{
      _id:    {type: String,      required: true},
      name:     {type: String,    required: true},
      email:    {type: String,    required: true}
  },
  question:   {type: String, required: true },
  response:   {type: String, required: true },
  isHide:   {type: Boolean}
}, { timestamps: true });

module.exports = mongoose.model('Faq', FaqSchema);