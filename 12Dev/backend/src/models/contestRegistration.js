const mongoose = require('mongoose');
const { Schema } = mongoose;

const contestRegistrationSchema = new Schema({
  contestId: {
    type: Schema.Types.ObjectId,
    ref: 'contest',
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  score: {
    type: Number,
    default: 0
  },
  penalty: {
    type: Number, // in seconds from contest start (to break ties on equal scores)
    default: 0
  },
  rank: {
    type: Number,
    default: 0
  },
  solvedProblems: [{
    problemId: {
      type: Schema.Types.ObjectId,
      ref: 'problem'
    },
    solvedAt: {
      type: Date
    },
    attempts: {
      type: Number,
      default: 0
    }
  }],
  startedAt: {
    type: Date // useful for virtual contests to track duration individually
  }
}, {
  timestamps: true
});

// Enforce unique registration per user per contest
contestRegistrationSchema.index({ contestId: 1, userId: 1 }, { unique: true });

// Optimizes sorting/leaderboards: sort by score descending, then penalty ascending
contestRegistrationSchema.index({ contestId: 1, score: -1, penalty: 1 });

const ContestRegistration = mongoose.model('contestRegistration', contestRegistrationSchema);

module.exports = ContestRegistration;
