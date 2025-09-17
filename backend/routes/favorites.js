const express = require('express');
const router = express.Router();
const Favorite = require('../models/Favorite');
const Template = require('../models/template');
const { authenticate } = require('../middleware/authMiddleware');

// GET /api/favorites - get user's favorites with populated template data
router.get('/', authenticate, async (req, res) => {
  try {
    const favorites = await Favorite.find({ userId: req.user.userId }).populate({
      path: 'templateId',
      // Handle cases where template might be deleted but favorite still exists
      options: { allowNull: true }
    });
    
    // Filter out favorites where templateId is null (template was deleted)
    const validFavorites = favorites.filter(fav => fav.templateId !== null);
    
    res.json(validFavorites);
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({ message: 'Server error fetching favorites' });
  }
});

// POST /api/favorites/:templateId - add template to favorites
router.post('/:templateId', authenticate, async (req, res) => {
  const { templateId } = req.params;
  try {
    console.log('Adding favorite for user:', req.user.userId, 'template:', templateId, 'user role:', req.user.role);
    
    // Validate templateId format
    if (!templateId || !templateId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid template ID format' });
    }

    // Check if template exists
    const template = await Template.findById(templateId);
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    // Check if already favorited
    const existingFavorite = await Favorite.findOne({ userId: req.user.userId, templateId });
    if (existingFavorite) {
      return res.status(409).json({ message: 'Template already in favorites' });
    }

    // Create new favorite
    const favorite = await Favorite.create({
      userId: req.user.userId,
      templateId: templateId
    });

    await favorite.populate('templateId');
    res.status(201).json(favorite);
  } catch (error) {
    console.error('Error adding favorite:', error);
    if (error.code === 11000) { // MongoDB duplicate key error
      return res.status(409).json({ message: 'Template already in favorites' });
    }
    res.status(500).json({ message: 'Server error adding favorite' });
  }
});

// DELETE /api/favorites/:templateId - remove from favorites
router.delete('/:templateId', authenticate, async (req, res) => {
  const { templateId } = req.params;
  try {
    const result = await Favorite.findOneAndDelete({ userId: req.user.userId, templateId });
    if (!result) {
      return res.status(404).json({ message: 'Favorite not found' });
    }
    res.json({ message: 'Removed from favorites' });
  } catch (error) {
    console.error('Error removing favorite:', error);
    res.status(500).json({ message: 'Server error removing favorite' });
  }
});

// GET /api/favorites/check/:templateId - check if template is favorited
router.get('/check/:templateId', authenticate, async (req, res) => {
  const { templateId } = req.params;
  try {
    const favorite = await Favorite.findOne({ userId: req.user.userId, templateId });
    res.json({ favorited: !!favorite });
  } catch (error) {
    console.error('Error checking favorite:', error);
    res.status(500).json({ message: 'Server error checking favorite' });
  }
});

module.exports = router;
