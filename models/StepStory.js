const mongoose = require('mongoose');

const StepStorySchema = new mongoose.Schema({
  event:{
    _id:  {type: String,  required: true},
    title:{type: String,  required: true}
  },
  manager:{
      _id:    {type: String,      required: true},
      name:     {type: String,    required: true},
      email:    {type: String,    required: true}
  },
  title:   {type: String, required: true },
  date:  {type: String},
  description:  {type: String},
  hasImage:   {type: Boolean,default:false},
  isHide:   {type: Boolean}
}, { timestamps: true });

module.exports = mongoose.model('StepStory', StepStorySchema);