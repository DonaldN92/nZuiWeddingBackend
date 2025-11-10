const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
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
  response:   {type: Number, required: true },
  mark:   {type: Number, required: true },
  choose1: {type: String, required: true },
  choose2: {type: String, required: true },
  choose3: {type: String },
  choose4: {type: String },
  description:  {type: String},
  isHide:   {type: Boolean}
}, { timestamps: true });

module.exports = mongoose.model('Question', QuestionSchema);