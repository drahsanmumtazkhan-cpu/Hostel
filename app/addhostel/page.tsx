import React, { useState } from 'react';

export default function AddHostelPage() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [owner, setOwner] = useState(''); // For demo, user enters username
  const [message, setMessage] = useState('');

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
    } else {
      setMessage(data.error || 'Failed to add hostel');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto' }}>
      <h2>Add Hostel</h2>
      <form onSubmit={handleAddHostel}>
        <input
          type="text"
          placeholder="Hostel Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        /><br />
        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={e => setAddress(e.target.value)}
          required
        /><br />
        <input
          type="text"
          placeholder="Your Username"
          value={owner}
          onChange={e => setOwner(e.target.value)}
          required
        /><br />
        <button type="submit">Add Hostel</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
