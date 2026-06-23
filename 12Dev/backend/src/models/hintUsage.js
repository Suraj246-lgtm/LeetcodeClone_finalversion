const mongoose = require('mongoose');
const { Schema } = mongoose;

const hintUsageSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  problemId: {
    type: Schema.Types.ObjectId,
    ref: 'problem',
    required: true
  },
  level: {
    type: Number,
    enum: [1, 2, 3], // 1: subtle hint, 2: key algorithm/approach, 3: pseudocode
    required: true
  },
  hint: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Compound index to quickly check if a user has already generated/revealed a specific level's hint
hintUsageSchema.index({ userId: 1, problemId: 1, level: 1 }, { unique: true });

const HintUsage = mongoose.model('hintUsage', hintUsageSchema);

module.exports = HintUsage;
