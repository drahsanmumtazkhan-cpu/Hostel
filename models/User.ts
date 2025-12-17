import mongoose, { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'student', 'warden'], default: 'student' },
  email: { type: String },
  phone: { type: String },
  isPremium: { type: Boolean, default: false },
  studentId: { type: String },
  roomId: { type: Schema.Types.ObjectId, ref: 'Hostel' },
  createdAt: { type: Date, default: Date.now },
});

const User = models.User || model('User', UserSchema);
export default User;
