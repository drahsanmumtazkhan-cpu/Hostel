import { connectToDatabase } from '@/lib/mongodb';
import Hostel from '@/models/Hostel';

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
