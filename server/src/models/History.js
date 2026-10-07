import mongoose from 'mongoose';

const historySchema = new mongoose.Schema(
  {
    // null for guests (the controller only persists logged-in runs, but the schema allows guests)
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, index: true },
    originalImageUrl: { type: String, required: true },
    processedImageUrl: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

historySchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model('History', historySchema);
