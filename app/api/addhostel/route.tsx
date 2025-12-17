
import { connectToDatabase } from '@/lib/mongodb';
import mongoose, { Schema, model, models } from 'mongoose';

const HostelSchema = new Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    owner: { type: String, required: true }, // username of the user who added
});

const Hostel = models.Hostel || model('Hostel', HostelSchema);

export async function POST(req: Request) {
    const { name, address, owner } = await req.json();
    if (!name || !address || !owner) {
        return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 });
    }
    await connectToDatabase();
    const hostel = await Hostel.create({ name, address, owner });
    return new Response(JSON.stringify({ message: 'Hostel added', hostel }), { status: 201 });
}

export async function GET() {
    await connectToDatabase();
    const hostels = await Hostel.find();
    return new Response(JSON.stringify({ hostels }), { status: 200 });
}