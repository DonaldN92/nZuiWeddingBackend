const mongoose = require('mongoose');

const GuestSchema = new mongoose.Schema({
  event:{
    _id:  {type: String,  required: true},
    title:{type: String,  required: true}
  },
  manager:{
      _id:    {type: String,      required: true},
      name:     {type: String,    required: true},
      email:    {type: String,    required: true}
  },
  name:   {type: String, required: true },
  email:  {type: String},
  phone:  {type: String},
  isAttending: { type: Boolean, default: false },
  plusOnes: { type: Number, default: 0 },
  //dietaryRequirements: { type: String },
  message: {type: String },
  invitationSent: {type: Boolean, default: false },
  responded: {type: Boolean, default: false },
  isHide:   {type: Boolean}
}, { timestamps: true });

module.exports = mongoose.model('Guest', GuestSchema);