const express = require('express');
const Registration = require('../models/Registration');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Public route - Create new registration
router.post('/', async (req, res) => {
  try {
    const registration = new Registration(req.body);
    await registration.save();
    
    res.status(201).json({
      success: true,
      message: 'Registration successful!',
      data: registration
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    });
  }
});

// Protected route - Get all registrations (Admin only)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const registrations = await Registration.find().sort({ registeredAt: -1 });
    
    res.json({
      success: true,
      count: registrations.length,
      data: registrations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching registrations',
      error: error.message
    });
  }
});

// Protected route - Delete registration (Admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await Registration.findByIdAndDelete(req.params.id);
    
    res.json({
      success: true,
      message: 'Registration deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting registration',
      error: error.message
    });
  }
});

module.exports = router;