const express = require('express');
const streakRouter = express.Router();
const userMiddleware = require('../middleware/userMiddleware');
const { getStreakStats, getHeatmapData } = require('../controllers/streakController');

streakRouter.get('/stats', userMiddleware, getStreakStats);
streakRouter.get('/heatmap', userMiddleware, getHeatmapData);

module.exports = streakRouter;
