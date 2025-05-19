const express = require('express');
const router = express.Router();
const { Agency, User, Complaint, Category } = require('../models');
const { sequelize } = require('../models');
const bcrypt = require('bcrypt');

// Get all agencies
router.get('/', async (req, res) => {
    try {
        const agencies = await Agency.findAll({
            include: [
                { model: User, as: 'administrator', attributes: ['id', 'firstName', 'lastName'] }
            ]
        });
        res.json(agencies);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get agency by ID
router.get('/:id', async (req, res) => {
    try {
        const agency = await Agency.findByPk(req.params.id, {
            include: [
                { model: User, as: 'administrator', attributes: ['id', 'firstName', 'lastName'] }
            ]
        });

        if (!agency) {
            return res.status(404).json({ error: 'Agency not found' });
        }

        res.json(agency);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create a new agency
router.post('/', async (req, res) => {
    try {
        const { 
            name, 
            description, 
            address, 
            phone, 
            email, 
            website,
            // Official user details
            officialFirstName,
            officialLastName,
            officialEmail,
            officialPassword,
            officialPhone
        } = req.body;
        
        // Start a transaction to ensure both user and agency are created or neither is
        const result = await sequelize.transaction(async (t) => {
            // 1. Create the official user first
            const hashedPassword = await bcrypt.hash(officialPassword, 10);
            
            const official = await User.create({
                firstName: officialFirstName,
                lastName: officialLastName,
                email: officialEmail,
                password: hashedPassword,
                phone: officialPhone,
                address: address, // Use the agency address for the official
                role: 'official',
                status: 'active'
            }, { transaction: t });
            
            // 2. Create the agency with the new official as administrator
            const agency = await Agency.create({
                name,
                description,
                address,
                phone,
                email,
                website,
                administratorId: official.id,
                status: 'active'
            }, { transaction: t });
            
            return { agency, official };
        });
        
        // Return success response with both IDs
        res.status(201).json({ 
            message: 'Agency and official account created successfully', 
            agencyId: result.agency.id,
            officialId: result.official.id
        });
    } catch (error) {
        console.error('Error creating agency and official:', error);
        res.status(400).json({ error: error.message });
    }
});

// Update agency
router.put('/:id', async (req, res) => {
    try {
        const { name, description, address, phone, email, website, status } = req.body;
        const agency = await Agency.findByPk(req.params.id);

        if (!agency) {
            return res.status(404).json({ error: 'Agency not found' });
        }

        await agency.update({
            name,
            description,
            address,
            phone,
            email,
            website,
            status
        });

        res.json({ message: 'Agency updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete agency
router.delete('/:id', async (req, res) => {
    try {
        const agency = await Agency.findByPk(req.params.id);

        if (!agency) {
            return res.status(404).json({ error: 'Agency not found' });
        }

        await agency.destroy();
        res.json({ message: 'Agency deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get complaints assigned to agency
router.get('/:id/complaints', async (req, res) => {
    try {
        const complaints = await Complaint.findAll({
            where: { assignedToId: req.params.id },
            include: [
                { model: User, as: 'submitter', attributes: ['id', 'firstName', 'lastName'] },
                { model: Category, as: 'category', attributes: ['id', 'name'] }
            ]
        });

        res.json(complaints);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
