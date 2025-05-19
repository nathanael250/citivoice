const express = require('express');
const router = express.Router();
const { Category, Agency, Complaint } = require('../models');

// Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.findAll({
      include: [
        { model: Agency, as: 'defaultAgency', attributes: ['id', 'name'] }
      ]
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get category by ID
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id, {
      include: [
        { model: Agency, as: 'defaultAgency', attributes: ['id', 'name'] }
      ]
    });
    
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new category
router.post('/', async (req, res) => {
  try {
    const { name, description, defaultAgencyId, isActive, icon } = req.body;
    
    const category = await Category.create({
      name,
      description,
      defaultAgencyId,
      isActive: isActive !== undefined ? isActive : true,
      icon
    });
    
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
