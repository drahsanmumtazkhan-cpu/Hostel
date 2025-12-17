import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';

// Get all wardens
export async function GET() {
    try {
        await connectToDatabase();
        const wardens = await User.find({ role: 'warden' }).select('username name email');
        return new Response(JSON.stringify({ wardens }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to fetch wardens' }), { status: 500 });
    }
}
