import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req: Request) {
  try {
    const { username } = await req.json();
    
    if (!username) {
      return new Response(JSON.stringify({ error: 'Username is required' }), { status: 400 });
    }

    await connectToDatabase();
    const user = await User.findOne({ username });
    
    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
    }

    user.isPremium = true;
    await user.save();

    return new Response(JSON.stringify({ 
      message: 'Premium activated successfully!',
      user: { name: user.name, username: user.username, isPremium: user.isPremium }
    }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to activate premium' }), { status: 500 });
  }
}
