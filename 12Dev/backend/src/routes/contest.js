const express = require('express');
const contestRouter = express.Router();
const userMiddleware = require('../middleware/userMiddleware');
const {
  createContest,
  getContests,
  getContestDetails,
  registerForContest,
  startVirtualContest,
  submitContestProblem,
  getContestLeaderboard,
  getContestRegistration
} = require('../controllers/contestController');

contestRouter.get('/all', userMiddleware, getContests);
contestRouter.post('/create', userMiddleware, createContest);
contestRouter.get('/:id', userMiddleware, getContestDetails);
contestRouter.get('/:id/registration', userMiddleware, getContestRegistration);
contestRouter.post('/:id/register', userMiddleware, registerForContest);
contestRouter.post('/:id/virtual', userMiddleware, startVirtualContest);
contestRouter.post('/:id/submit/:problemId', userMiddleware, submitContestProblem);
contestRouter.get('/:id/leaderboard', userMiddleware, getContestLeaderboard);

module.exports = contestRouter;
