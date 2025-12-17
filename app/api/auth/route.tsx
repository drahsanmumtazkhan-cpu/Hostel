import { connectToDatabase } from '@/lib/mongodb';
import mongoose, { Schema, model, models } from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = models.User || model('User', UserSchema);

export async function POST(req: Request) {
  // Signup
  const { name, username, password } = await req.json();
  if (!name || !username || !password) {
    return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 });
  }
  await connectToDatabase();
  const existing = await User.findOne({ username });
  if (existing) {
    return new Response(JSON.stringify({ error: 'Username already exists' }), { status: 409 });
  }
  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, username, password: hashed });
  return new Response(JSON.stringify({ message: 'User created', user: { name: user.name, username: user.username } }), { status: 201 });
}

export async function PUT(req: Request) {
  // Login
  const { username, password } = await req.json();
  if (!username || !password) {
    return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 });
  }
  await connectToDatabase();
  const user = await User.findOne({ username });
  if (!user) {
    return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 });
  }
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 });
  }
  // For demo: return user info (no JWT/session)
  return new Response(JSON.stringify({ message: 'Login successful', user: { name: user.name, username: user.username } }), { status: 200 });
}
