const mongoose = require('mongoose');

const ScheduleSchema = new mongoose.Schema({
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
  date:  {type: Date},
  type: {type: String },
  location: { type: String},
  description:  {type: String},
  guests: { type: String },
  isHide:   {type: Boolean}
}, { timestamps: true });

module.exports = mongoose.model('Schedule', ScheduleSchema);