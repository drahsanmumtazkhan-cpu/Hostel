import { connectToDatabase } from '@/lib/mongodb';
import Hostel from '@/models/Hostel';

// Add a room to a hostel
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const { roomNumber, capacity } = await req.json();
        if (!roomNumber || !capacity) {
            return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 });
        }
        
        await connectToDatabase();
        const hostel = await Hostel.findById(id);
        if (!hostel) {
            return new Response(JSON.stringify({ error: 'Hostel not found' }), { status: 404 });
        }

        // Check if room number already exists
        const roomExists = hostel.rooms.some((r: any) => r.roomNumber === roomNumber);
        if (roomExists) {
            return new Response(JSON.stringify({ error: 'Room number already exists' }), { status: 409 });
        }

        hostel.rooms.push({ roomNumber, capacity, occupants: [] });
        hostel.totalRooms = hostel.rooms.length;
        await hostel.save();

        return new Response(JSON.stringify({ message: 'Room added', hostel }), { status: 201 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to add room' }), { status: 500 });
    }
}

// Delete a room
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const { roomId } = await req.json();
        if (!roomId) {
            return new Response(JSON.stringify({ error: 'Room ID required' }), { status: 400 });
        }

        await connectToDatabase();
        const hostel = await Hostel.findById(id);
        if (!hostel) {
            return new Response(JSON.stringify({ error: 'Hostel not found' }), { status: 404 });
        }

        hostel.rooms = hostel.rooms.filter((r: any) => r._id.toString() !== roomId);
        hostel.totalRooms = hostel.rooms.length;
        await hostel.save();

        return new Response(JSON.stringify({ message: 'Room deleted', hostel }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to delete room' }), { status: 500 });
    }
}
