import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function PUT(req: Request) {
  try {
    const { username, oldPassword, newPassword } = await req.json();
    
    if (!username || !oldPassword || !newPassword) {
      return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 });
    }

    await connectToDatabase();
    const user = await User.findOne({ username });
    
    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
    }

    const valid = await bcrypt.compare(oldPassword, user.password);
    if (!valid) {
      return new Response(JSON.stringify({ error: 'Old password is incorrect' }), { status: 401 });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    return new Response(JSON.stringify({ message: 'Password changed successfully' }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to change password' }), { status: 500 });
  }
}
