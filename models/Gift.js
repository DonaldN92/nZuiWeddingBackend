const mongoose = require('mongoose');

const GiftSchema = new mongoose.Schema({
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
  description:  {type: String},
  status:  {type: String,default:"available"},
  
  price:  {type: Number},
  category: {type: String },
  link: { type: String},
  image: { type: String },
  isHide:   {type: Boolean}
}, { timestamps: true });

module.exports = mongoose.model('Gift', GiftSchema);