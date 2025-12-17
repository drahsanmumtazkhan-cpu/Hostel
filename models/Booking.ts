import mongoose, { Schema, model, models } from 'mongoose';

const BookingSchema = new Schema({
  hostelId: { type: Schema.Types.ObjectId, ref: 'Hostel', required: true },
  roomId: { type: String, required: true },
  studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  studentName: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  checkInDate: { type: Date },
  checkOutDate: { type: Date },
  monthlyRent: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Booking = models.Booking || model('Booking', BookingSchema);
export default Booking;
