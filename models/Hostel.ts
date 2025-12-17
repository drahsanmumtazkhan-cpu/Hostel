import mongoose, { Schema, model, models } from 'mongoose';

const HostelSchema = new Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  owner: { type: String, required: true },
});

const Hostel = models.Hostel || model('Hostel', HostelSchema);
export default Hostel;
