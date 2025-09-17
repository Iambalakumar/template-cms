const Template = require('../Models/template');


// Get all templates with optional filtering
exports.getAllTemplates = async (req, res) => {
  try {
    const { author, search } = req.query;
    let query = {};

    // Filter by author if provided
    if (author) {
      query.author = author;
    }

    // Search by title if provided
    if (search) {
      query.title = { $regex: search, $options: 'i' }; // Case-insensitive search
    }

    const templates = await Template.find(query);
    res.json(templates);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get templates by specific author
exports.getTemplatesByAuthor = async (req, res) => {
  try {
    const { author } = req.params;
    const templates = await Template.find({ author });
    res.json(templates);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Search templates by title
exports.searchTemplates = async (req, res) => {
  try {
    const { q } = req.query;
    const templates = await Template.find({
      title: { $regex: q, $options: 'i' }
    });
    res.json(templates);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.createTemplate = async (req, res) => {
  try {
    const { title, description, thumbnail, previewLink, downloadLink } = req.body;

    if (!title || !description || !thumbnail || !previewLink || !downloadLink) {
      return res.status(400).json({ message: 'Please provide all required fields.' });
    }

    // Assuming req.user contains authenticated user info with username
    const author = req.user?.name || 'Unknown';

    const newTemplate = new Template({
      title,
      description,
      thumbnail,
      previewLink,
      downloadLink,
      author,
    });

    await newTemplate.save();
    res.status(201).json({ message: 'Template created successfully!', template: newTemplate });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Update a template (admin only)
exports.updateTemplate = async (req, res) => {
  try {
    const templateId = req.params.id;
    const { title, description, thumbnail, previewLink, downloadLink } = req.body;

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    const updatedTemplate = await Template.findByIdAndUpdate(
      templateId,
      { title, description, thumbnail, previewLink, downloadLink },
      { new: true }
    );

    if (!updatedTemplate) {
      return res.status(404).json({ message: 'Template not found.' });
    }

    res.json({ message: 'Template updated successfully.', template: updatedTemplate });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Delete a template (admin only)
exports.deleteTemplate = async (req, res) => {
  try {
    const templateId = req.params.id;

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    const deletedTemplate = await Template.findByIdAndDelete(templateId);

    if (!deletedTemplate) {
      return res.status(404).json({ message: 'Template not found.' });
    }

    res.json({ message: 'Template deleted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
