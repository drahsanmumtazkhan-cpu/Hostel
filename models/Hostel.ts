import mongoose, { Schema, model, models } from 'mongoose';

const OccupantSchema = new Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  joinDate: { type: Date, default: Date.now },
  rent: { type: Number, required: true },
  isPaid: { type: Boolean, default: false },
});

const RoomSchema = new Schema({
  roomNumber: { type: String, required: true },
  capacity: { type: Number, required: true },
  occupants: [OccupantSchema],
});

const HostelSchema = new Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  owner: { type: String, required: true },
  warden: { type: String, default: null }, // Warden username assigned to this hostel
  totalRooms: { type: Number, default: 0 },
  rooms: [RoomSchema],
  createdAt: { type: Date, default: Date.now },
});

const Hostel = models.Hostel || model('Hostel', HostelSchema);
export default Hostel;
