import mongoose, { Schema, model, models } from 'mongoose';

const NoticeSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  type: { type: String, enum: ['general', 'urgent', 'event', 'maintenance'], default: 'general' },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  hostelId: { type: Schema.Types.ObjectId, ref: 'Hostel' },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

const Notice = models.Notice || model('Notice', NoticeSchema);
export default Notice;
