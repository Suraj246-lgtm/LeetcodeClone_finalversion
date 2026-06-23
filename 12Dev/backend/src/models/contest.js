const mongoose = require('mongoose');
const { Schema } = mongoose;

const contestSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  duration: {
    type: Number, // in minutes
    required: true
  },
  problems: [{
    type: Schema.Types.ObjectId,
    ref: 'problem'
  }],
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  status: {
    type: String,
    enum: ['upcoming', 'active', 'ended'],
    default: 'upcoming'
  },
  isVirtual: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const Contest = mongoose.model('contest', contestSchema);

module.exports = Contest;
