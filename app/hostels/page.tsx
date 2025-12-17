"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HostelsPage() {
  const [hostels, setHostels] = useState([]);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [message, setMessage] = useState('');
  const [owner, setOwner] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in (simple localStorage check)
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user) {
      router.replace('/login');
      return;
    }
    setOwner(user.username);
    fetchHostels();
  }, []);

  const fetchHostels = async () => {
    const res = await fetch('/api/addhostel');
    const data = await res.json();
    setHostels(data.hostels || []);
  };

  const handleAddHostel = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    const res = await fetch('/api/addhostel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, address, owner }),
    });
    const data = await res.json();
    if (res.ok) {
      setMessage('Hostel added!');
      setName('');
      setAddress('');
      fetchHostels();
    } else {
      setMessage(data.error || 'Failed to add hostel');
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto' }}>
      <h2>All Hostels</h2>
      <ul>
        {hostels.map((h: any) => (
          <li key={h._id}><b>{h.name}</b> - {h.address} (by {h.owner})</li>
        ))}
      </ul>
      <h3>Add Hostel</h3>
      <form onSubmit={handleAddHostel}>
        <input
          type="text"
          placeholder="Hostel Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />{' '}
        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={e => setAddress(e.target.value)}
          required
        />{' '}
        <button type="submit">Add</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
