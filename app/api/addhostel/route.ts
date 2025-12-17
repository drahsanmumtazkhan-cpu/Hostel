import { connectToDatabase } from '@/lib/mongodb';
import Hostel from '@/models/Hostel';

export async function POST(req: Request) {
    const { name, address, owner, warden } = await req.json();
    if (!name || !address || !owner) {
        return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 });
    }
    await connectToDatabase();
    const hostel = await Hostel.create({ name, address, owner, warden: warden || null, totalRooms: 0, rooms: [] });
    return new Response(JSON.stringify({ message: 'Hostel added', hostel }), { status: 201 });
}

export async function GET() {
    await connectToDatabase();
    const hostels = await Hostel.find();
    return new Response(JSON.stringify({ hostels }), { status: 200 });
}

export async function PUT(req: Request) {
    const { id, name, address, warden } = await req.json();
    if (!id || !name || !address) {
        return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 });
    }
    await connectToDatabase();
    const updateData: any = { name, address };
    if (warden !== undefined) updateData.warden = warden;
    const hostel = await Hostel.findByIdAndUpdate(id, updateData, { new: true });
    if (!hostel) {
        return new Response(JSON.stringify({ error: 'Hostel not found' }), { status: 404 });
    }
    return new Response(JSON.stringify({ message: 'Hostel updated', hostel }), { status: 200 });
}

export async function DELETE(req: Request) {
    const { id } = await req.json();
    if (!id) {
        return new Response(JSON.stringify({ error: 'Hostel ID required' }), { status: 400 });
    }
    await connectToDatabase();
    const hostel = await Hostel.findByIdAndDelete(id);
    if (!hostel) {
        return new Response(JSON.stringify({ error: 'Hostel not found' }), { status: 404 });
    }
    return new Response(JSON.stringify({ message: 'Hostel deleted' }), { status: 200 });
}
