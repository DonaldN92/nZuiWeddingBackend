const mongoose = require('mongoose');

const AccomodationSchema = new mongoose.Schema({
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
  cost: {type: Number },
  address:  {type: String},
  location:  {type: String},
  isHide:   {type: Boolean}
}, { timestamps: true });

module.exports = mongoose.model('Accomodation', AccomodationSchema);