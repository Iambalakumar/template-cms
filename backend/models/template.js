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
  },
  author: {
    type: String,
    required: true
  }
  // LanguageUsed: {
  //     type: [String],
  //     required: true
  // }
}, { timestamps: true });

const Template = mongoose.models.Template || mongoose.model('Template', templateSchema);
module.exports = Template;
