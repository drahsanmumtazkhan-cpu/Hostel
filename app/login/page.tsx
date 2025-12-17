"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    const res = await fetch('/api/auth', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (res.ok) {
      toast.success('Login successful!');
      localStorage.setItem('user', JSON.stringify(data.user));
      setTimeout(() => router.replace('/hostels'), 700);
    } else {
      toast.error(data.error || 'Login failed');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <Toaster position="top-center"/>
      <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Login</h2>
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
          style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc' }}
        />
        <button type="submit" style={{
          padding: '10px 0',
          borderRadius: 6,
          background: 'linear-gradient(90deg, #6366f1, #60a5fa)',
          color: 'white',
          fontWeight: 600,
          border: 'none',
          fontSize: 16,
          cursor: 'pointer',
          marginTop: 8
        }}>Login</button>
      </form>
      <div style={{ marginTop: 18, textAlign: 'center' }}>
        <a href="/signup" style={{ color: '#2563eb', textDecoration: 'underline' }}>Don't have an account? Sign up</a>
      </div>
    </div>
  );
}
