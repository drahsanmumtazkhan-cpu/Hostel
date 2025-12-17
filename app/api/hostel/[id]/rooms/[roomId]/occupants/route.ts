import { connectToDatabase } from '@/lib/mongodb';
import Hostel from '@/models/Hostel';

// Add an occupant to a room
export async function POST(req: Request, { params }: { params: Promise<{ id: string; roomId: string }> }) {
    try {
        const { id, roomId } = await params;
        const { name, phone, email, rent } = await req.json();
        if (!name || !phone || !rent) {
            return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
        }
        
        await connectToDatabase();
        const hostel = await Hostel.findById(id);
        if (!hostel) {
            return new Response(JSON.stringify({ error: 'Hostel not found' }), { status: 404 });
        }

        const room = hostel.rooms.find((r: any) => r._id.toString() === roomId);
        if (!room) {
            return new Response(JSON.stringify({ error: 'Room not found' }), { status: 404 });
        }

        if (room.occupants.length >= room.capacity) {
            return new Response(JSON.stringify({ error: 'Room is full' }), { status: 400 });
        }

        room.occupants.push({ name, phone, email, rent, isPaid: false, joinDate: new Date() });
        await hostel.save();

        return new Response(JSON.stringify({ message: 'Occupant added', hostel }), { status: 201 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to add occupant' }), { status: 500 });
    }
}

// Update occupant payment status
export async function PUT(req: Request, { params }: { params: Promise<{ id: string; roomId: string }> }) {
    try {
        const { id, roomId } = await params;
        const { occupantId, isPaid } = await req.json();
        if (!occupantId || isPaid === undefined) {
            return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 });
        }

        await connectToDatabase();
        const hostel = await Hostel.findById(id);
        if (!hostel) {
            return new Response(JSON.stringify({ error: 'Hostel not found' }), { status: 404 });
        }

        const room = hostel.rooms.find((r: any) => r._id.toString() === roomId);
        if (!room) {
            return new Response(JSON.stringify({ error: 'Room not found' }), { status: 404 });
        }

        const occupant = room.occupants.find((o: any) => o._id.toString() === occupantId);
        if (!occupant) {
            return new Response(JSON.stringify({ error: 'Occupant not found' }), { status: 404 });
        }

        occupant.isPaid = isPaid;
        await hostel.save();

        return new Response(JSON.stringify({ message: 'Payment status updated', hostel }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to update payment' }), { status: 500 });
    }
}

// Remove an occupant
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string; roomId: string }> }) {
    try {
        const { id, roomId } = await params;
        const { occupantId } = await req.json();
        if (!occupantId) {
            return new Response(JSON.stringify({ error: 'Occupant ID required' }), { status: 400 });
        }

        await connectToDatabase();
        const hostel = await Hostel.findById(id);
        if (!hostel) {
            return new Response(JSON.stringify({ error: 'Hostel not found' }), { status: 404 });
        }

        const room = hostel.rooms.find((r: any) => r._id.toString() === roomId);
        if (!room) {
            return new Response(JSON.stringify({ error: 'Room not found' }), { status: 404 });
        }

        room.occupants = room.occupants.filter((o: any) => o._id.toString() !== occupantId);
        await hostel.save();

        return new Response(JSON.stringify({ message: 'Occupant removed', hostel }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to remove occupant' }), { status: 500 });
    }
}
