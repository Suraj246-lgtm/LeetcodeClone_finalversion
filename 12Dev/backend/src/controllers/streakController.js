const DailyActivity = require('../models/dailyActivity');
const User = require('../models/user');

const getStreakStats = async (req, res) => {
  try {
    const userId = req.result._id;
    const user = await User.findById(userId).select('currentStreak longestStreak lastSolvedDate totalSolved');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      currentStreak: user.currentStreak || 0,
      longestStreak: user.longestStreak || 0,
      lastSolvedDate: user.lastSolvedDate,
      totalSolved: user.totalSolved || 0
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching streak stats: ' + err.message });
  }
};

const getHeatmapData = async (req, res) => {
  try {
    const userId = req.result._id;
    
    // Get activity from the last 365 days
    const oneYearAgo = new Date();
    oneYearAgo.setDate(oneYearAgo.getDate() - 365);
    const dateLimitString = oneYearAgo.toISOString().split('T')[0];

    const activities = await DailyActivity.find({
      userId,
      date: { $gte: dateLimitString }
    }).select('date count problemsSolved');

    res.status(200).json(activities);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching heatmap data: ' + err.message });
  }
};

module.exports = {
  getStreakStats,
  getHeatmapData
};
