import mongoose, { Schema, model, models } from 'mongoose';

const VisitorSchema = new Schema({
  hostelId: { type: Schema.Types.ObjectId, ref: 'Hostel', required: true },
  studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  visitorName: { type: String, required: true },
  visitorPhone: { type: String, required: true },
  visitorCNIC: { type: String },
  purpose: { type: String, required: true },
  checkInTime: { type: Date, default: Date.now },
  checkOutTime: { type: Date },
  approvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['pending', 'approved', 'checked-out', 'rejected'], default: 'pending' },
  roomNumber: { type: String },
});

const Visitor = models.Visitor || model('Visitor', VisitorSchema);
export default Visitor;
