const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
  title: {
    type: String, 
    required: true 
  },
  description: {
     type: String,
    required: true
  },
  thumbnail: {
     type: String, 
     required: true 
  },
  previewLink: {
     type: String, 
     required: true 
  },
  downloadLink: {
     type: String, 
     required: true 
  }
  // LanguageUsed: {
  //     type: [String],
  //     required: true
  // }
}, { timestamps: true });

module.exports = mongoose.model('Template', templateSchema);
