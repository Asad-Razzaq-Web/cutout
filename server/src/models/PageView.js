import mongoose from 'mongoose';

/** Privacy-friendly analytics: random visitor id from the browser, no IP address stored. */
const pageViewSchema = new mongoose.Schema(
  {
    visitorId: { type: String, required: true, maxlength: 64 },
    path: { type: String, required: true, maxlength: 200 },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

pageViewSchema.index({ createdAt: -1 });
pageViewSchema.index({ visitorId: 1, createdAt: -1 });

export default mongoose.model('PageView', pageViewSchema);