const express = require('express');
const aiRouter =  express.Router();
const userMiddleware = require("../middleware/userMiddleware");
const solveDoubt = require('../controllers/solveDoubt');
const { getOrCreateHint, getRevealedHints } = require('../controllers/hintController');

aiRouter.post('/chat', userMiddleware, solveDoubt);
aiRouter.post('/hint/:problemId', userMiddleware, getOrCreateHint);
aiRouter.get('/hint/:problemId/revealed', userMiddleware, getRevealedHints);

module.exports = aiRouter;