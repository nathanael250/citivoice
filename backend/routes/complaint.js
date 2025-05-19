const express = require('express');
const router = express.Router();
const { Complaint, User, Agency, Category, Response, Attachment } = require('../models');

// Get all complaints
router.get('/', async (req, res) => {
  try {
    const complaints = await Complaint.findAll({
      include: [
        { model: User, as: 'submitter', attributes: ['id', 'firstName', 'lastName'] },
        { model: Agency, as: 'assignedAgency', attributes: ['id', 'name'] },
        { model: Category, as: 'category', attributes: ['id', 'name'] }
      ]
    });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get complaint by ID
router.get('/:id', async (req, res) => {
  try {
    const complaint = await Complaint.findByPk(req.params.id, {
      include: [
        { model: User, as: 'submitter', attributes: ['id', 'firstName', 'lastName'] },
        { model: Agency, as: 'assignedAgency', attributes: ['id', 'name'] },
        { model: Category, as: 'category', attributes: ['id', 'name'] },
        { model: Response, as: 'responses', include: [
          { model: User, as: 'responder', attributes: ['id', 'firstName', 'lastName'] }
        ]},
        { model: Attachment, as: 'attachments' }
      ]
    });
    
    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }
    
    res.json(complaint);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new complaint
router.post('/', async (req, res) => {
  try {
    const { 
      title, 
      description, 
      categoryId, 
      location, 
      latitude, 
      longitude, 
      submittedById 
    } = req.body;
    
    const complaint = await Complaint.create({
      title,
      description,
      categoryId,
      status: 'submitted',
      priority: 'medium',
      location,
      latitude,
      longitude,
      submittedById
    });
    
    res.status(201).json(complaint);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update complaint
router.put('/:id', async (req, res) => {
  try {
    const { 
      title, 
      description, 
      categoryId, 
      status, 
      priority, 
      location, 
      latitude, 
      longitude 
    } = req.body;
    
    const complaint = await Complaint.findByPk(req.params.id);
    
    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }
    
    await complaint.update({
      title,
      description,
      categoryId,
      status,
      priority,
      location,
      latitude,
      longitude
    });
    
    res.json({ message: 'Complaint updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete complaint
router.delete('/:id', async (req, res) => {
  try {
    const complaint = await Complaint.findByPk(req.params.id);
    
    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }
    
    await complaint.destroy();
    res.json({ message: 'Complaint deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Assign complaint to agency
router.put('/:id/assign', async (req, res) => {
  try {
    const { assignedToId } = req.body;
    const complaint = await Complaint.findByPk(req.params.id);
    
    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }
    
    await complaint.update({
      assignedToId,
      status: 'assigned'
    });
    
    res.json({ message: 'Complaint assigned successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update complaint status
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const complaint = await Complaint.findByPk(req.params.id);
    
    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }
    
    await complaint.update({ status });
    
    res.json({ message: 'Complaint status updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
