const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  event:{_id:  {type: String,  required: true}},
  author:{
      name:     {type: String,    required: true},
      contact:    {type: String}
  },
  message:   {type: String, required: true },
  status: { type: String,enum:['pending','approved','rejected'],default:"pending"}
}, { timestamps: true });

module.exports = mongoose.model('Message', MessageSchema);