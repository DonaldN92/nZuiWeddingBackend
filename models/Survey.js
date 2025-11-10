const mongoose = require('mongoose');

const SurveySchema = new mongoose.Schema({
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
  choose:   {type: Number},
  isHide:   {type: Boolean}
}, { timestamps: true });

module.exports = mongoose.model('Survey', SurveySchema);