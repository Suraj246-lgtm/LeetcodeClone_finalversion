const mongoose = require('mongoose');
const { Schema } = mongoose;

const dailyActivitySchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  date: {
    type: String, // "YYYY-MM-DD" format for timezone-independent daily activity grouping
    required: true
  },
  count: {
    type: Number,
    default: 1
  },
  problemsSolved: [{
    type: Schema.Types.ObjectId,
    ref: 'problem'
  }]
}, {
  timestamps: true
});

// Compound index to guarantee uniqueness of a daily entry per user and fast retrieval
dailyActivitySchema.index({ userId: 1, date: 1 }, { unique: true });

const DailyActivity = mongoose.model('dailyActivity', dailyActivitySchema);

module.exports = DailyActivity;
