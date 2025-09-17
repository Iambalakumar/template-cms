const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const favoriteSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    templateId: { type: Schema.Types.ObjectId, ref: 'Template', required: true },
  },
  { timestamps: true }
);

// Compound unique index to prevent duplicate favorites by same user for same template
favoriteSchema.index({ userId: 1, templateId: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', favoriteSchema);
