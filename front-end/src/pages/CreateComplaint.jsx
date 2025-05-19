const express = require('express');
const router = express.Router();
const { Agency, User, Complaint, Category } = require('../models');
const { sequelize } = require('../models');
const bcrypt = require('bcrypt');

router.get('/', async (req, res) => {
    try {
        const agencies = await Agency.findAll({
            include: [
                { model: User, as: 'administrator', attributes: ['id', 'firstName', 'lastName'] }
            ]
        });
        res.json(agencies);
    } catch (error) {
        console.error('Error fetching agencies:', error);
        res.status(500).json({ error: error.message });
    }
});

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
        console.error('Error fetching agency:', error);
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
        
        console.log('Received agency registration data:', {
            name, description, address, phone, email, website,
            officialDetails: {
                firstName: officialFirstName,
                lastName: officialLastName,
                email: officialEmail,
                phone: officialPhone
                // password omitted for security
            }
        });
        
        // Validate required fields
        if (!name || !description || !address || !phone || !email ||
            !officialFirstName || !officialLastName || !officialEmail || !officialPassword || !officialPhone) {
            return res.status(400).json({ error: 'All required fields must be provided' });
        }
        
        
        const result = await sequelize.transaction(async (t) => {
            const hashedPassword = await bcrypt.hash(officialPassword, 10);
            
            const official = await User.create({
                firstName: officialFirstName,
                lastName: officialLastName,
                email: officialEmail,
                password: hashedPassword,
                phone: officialPhone,
                address: address,
                role: 'official',
                status: 'active'
            }, { transaction: t });
            
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
        
        res.status(201).json({ 
            message: 'Agency and official account created successfully', 
            agencyId: result.agency.id,
            officialId: result.official.id
        });
    } catch (error) {
        console.error('Error creating agency and official:', error);
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ 
                error: 'A user with this email already exists',
                details: error.errors.map(e => e.message)
            });
        } else if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ 
                error: 'Validation error',
                details: error.errors.map(e => e.message)
            });
        }
        res.status(400).json({ error: error.message });
    }
});


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
        console.error('Error updating agency:', error);
        res.status(500).json({ error: error.message });
    }
});


router.delete('/:id', async (req, res) => {
    try {
        const agency = await Agency.findByPk(req.params.id);

        if (!agency) {
            return res.status(404).json({ error: 'Agency not found' });
        }

        await agency.destroy();
        res.json({ message: 'Agency deleted successfully' });
    } catch (error) {
        console.error('Error deleting agency:', error);
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id/complaints', async (req, res) => {
    try {
        const agency = await Agency.findByPk(req.params.id);
        
        if (!agency) {
            return res.status(404).json({ error: 'Agency not found' });
        }
        
        const complaints = await Complaint.findAll({
            where: { assignedToId: req.params.id },
            include: [
                { model: User, as: 'submitter', attributes: ['id', 'firstName', 'lastName'] },
                { model: Category, as: 'category', attributes: ['id', 'name'] }
            ]
        });

        res.json(complaints);
    } catch (error) {
        console.error('Error fetching agency complaints:', error);
        res.status(500).json({ error: error.message });
    }
});

router.get('/official/:userId', async (req, res) => {
    try {
        const agency = await Agency.findOne({
            where: { administratorId: req.params.userId },
            include: [
                { model: User, as: 'administrator', attributes: ['id', 'firstName', 'lastName'] }
            ]
        });

        if (!agency) {
            return res.status(404).json({ error: 'No agency found for this official' });
        }

        res.json(agency);
    } catch (error) {
        console.error('Error fetching agency by official ID:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
