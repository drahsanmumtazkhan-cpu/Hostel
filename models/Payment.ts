import mongoose, { Schema, model, models } from 'mongoose';

const PaymentSchema = new Schema({
  studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  hostelId: { type: Schema.Types.ObjectId, ref: 'Hostel', required: true },
  amount: { type: Number, required: true },
  month: { type: String, required: true }, // e.g., "2025-01"
  paymentMethod: { type: String, enum: ['cash', 'card', 'online'], default: 'online' },
  transactionId: { type: String },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  paidAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

const Payment = models.Payment || model('Payment', PaymentSchema);
export default Payment;
