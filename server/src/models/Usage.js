import mongoose from 'mongoose';

/** One row per background-removal attempt, guests included. Powers the admin stats. */
const usageSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, index: true },
    status: { type: String, enum: ['success', 'failed'], required: true },
    bytes: { type: Number, default: 0 },
    error: { type: String, default: '', maxlength: 300 },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

usageSchema.index({ createdAt: -1 });

export default mongoose.model('Usage', usageSchema);