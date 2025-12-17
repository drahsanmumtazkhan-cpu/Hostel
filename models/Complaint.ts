import mongoose, { Schema, model, models } from 'mongoose';

const ComplaintSchema = new Schema({
  hostelId: { type: Schema.Types.ObjectId, ref: 'Hostel', required: true },
  studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  studentName: { type: String, required: true },
  roomNumber: { type: String },
  category: { type: String, enum: ['maintenance', 'cleanliness', 'security', 'other'], default: 'other' },
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['pending', 'in-progress', 'resolved', 'closed'], default: 'pending' },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
  resolvedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

const Complaint = models.Complaint || model('Complaint', ComplaintSchema);
export default Complaint;
