// routes/dashboardRoutes.js
const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController'); // Import the controller

// Define routes, now just pointing to controller functions
router.get('/stats', dashboardController.getDashboardStats);
router.get('/revenue/last7days', dashboardController.getRevenueLast7Days);

module.exports = router;