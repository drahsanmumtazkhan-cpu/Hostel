import { connectToDatabase } from '@/lib/mongodb';
import Hostel from '@/models/Hostel';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await connectToDatabase();
        const hostel = await Hostel.findById(id);
        if (!hostel) {
            return new Response(JSON.stringify({ error: 'Hostel not found' }), { status: 404 });
        }
        return new Response(JSON.stringify({ hostel }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to fetch hostel' }), { status: 500 });
    }
}
