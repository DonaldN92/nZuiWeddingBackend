const mongoose = require('mongoose');

const BulkMessageSchema = new mongoose.Schema({
  event:{
    _id:  {type: String,  required: true},
    title:{type: String,  required: true}
  },
  manager:{
      _id:    {type: String,      required: true},
      name:     {type: String,    required: true},
      email:    {type: String,    required: true}
  },
  recipients: { type: String, required: true},
  subject: {type: String, required: true},
  message:   {type: String, required: true },
  type:  {type: String,enum:["mail","sms"],default:"mail"},
  isHide:{type: Boolean}
}, { timestamps: true });

module.exports = mongoose.model('BulkMessage', BulkMessageSchema);