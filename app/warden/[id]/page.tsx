"use client";
import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { FaMapMarkerAlt, FaDoorOpen, FaUserPlus } from 'react-icons/fa';

export default function WardenHostelPage() {
  const params = useParams();
  const router = useRouter();
  const [hostel, setHostel] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [showOccupantModal, setShowOccupantModal] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState('');
  const [currentUser, setCurrentUser] = useState('');
  
  // Room form
  const [roomNumber, setRoomNumber] = useState('');
  const [capacity, setCapacity] = useState('');
  
  // Occupant form
  const [occupantName, setOccupantName] = useState('');
  const [occupantPhone, setOccupantPhone] = useState('');
  const [occupantEmail, setOccupantEmail] = useState('');
  const [rent, setRent] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user) {
      router.replace('/login');
      return;
    }
    if (user.role !== 'warden') {
      router.replace(user.role === 'student' ? '/student' : '/hostels');
      return;
    }
    setCurrentUser(user.username);
    fetchHostel(user.username);
  }, []);

  const fetchHostel = async (username?: string) => {
    try {
      const currentWarden = username || currentUser;
      const res = await fetch(`/api/hostel/${params.id}`);
      const data = await res.json();
      if (res.ok) {
        // Check if user is the warden of this hostel
        if (data.hostel.warden !== currentWarden && currentWarden) {
          toast.error('You can only manage hostels where you are assigned as warden');
          router.push('/warden');
          return;
        }
        setHostel(data.hostel);
      } else {
        toast.error('Failed to load hostel');
        router.push('/warden');
      }
    } catch (error) {
      toast.error('Error loading hostel');
    } finally {
      setLoading(false);
    }
  };

  const handleAddRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`/api/hostel/${params.id}/rooms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomNumber, capacity: parseInt(capacity) }),
    });
    const data = await res.json();
    if (res.ok) {
      toast.success('Room added successfully!');
      setRoomNumber('');
      setCapacity('');
      setShowRoomModal(false);
      fetchHostel();
    } else {
      toast.error(data.error || 'Failed to add room');
    }
  };

  const handleDeleteRoom = async (roomId: string) => {
    if (!confirm('Are you sure you want to delete this room?')) return;
    const res = await fetch(`/api/hostel/${params.id}/rooms`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomId }),
    });
    if (res.ok) {
      toast.success('Room deleted!');
      fetchHostel();
    } else {
      toast.error('Failed to delete room');
    }
  };

  const handleAddOccupant = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`/api/hostel/${params.id}/rooms/${selectedRoomId}/occupants`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: occupantName, phone: occupantPhone, email: occupantEmail, rent: parseInt(rent) }),
    });
    const data = await res.json();
    if (res.ok) {
      toast.success('Student added successfully!');
      setOccupantName('');
      setOccupantPhone('');
      setOccupantEmail('');
      setRent('');
      setShowOccupantModal(false);
      fetchHostel();
    } else {
      toast.error(data.error || 'Failed to add student');
    }
  };

  const handleRemoveOccupant = async (roomId: string, occupantId: string) => {
    if (!confirm('Remove this student?')) return;
    const res = await fetch(`/api/hostel/${params.id}/rooms/${roomId}/occupants`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ occupantId }),
    });
    if (res.ok) {
      toast.success('Student removed!');
      fetchHostel();
    } else {
      toast.error('Failed to remove student');
    }
  };

  const handleTogglePayment = async (roomId: string, occupantId: string, currentStatus: boolean) => {
    const res = await fetch(`/api/hostel/${params.id}/rooms/${roomId}/occupants`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ occupantId, isPaid: !currentStatus }),
    });
    if (res.ok) {
      toast.success('Payment status updated!');
      fetchHostel();
    } else {
      toast.error('Failed to update payment');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto mb-4"></div>
          <p className="text-black text-xl font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  if (!hostel) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100">
      <Toaster position="top-center" />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <button 
            onClick={() => router.push('/warden')} 
            className="text-white hover:text-green-100 mb-4 flex items-center gap-2 font-medium transition"
          >
            <span>←</span> Back to My Hostels
          </button>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">{hostel.name}</h1>
              <p className="text-green-100 flex items-center gap-2 mb-2">
                <FaMapMarkerAlt /> {hostel.address}
              </p>
              <p className="text-sm text-green-100">Owner: {hostel.owner}</p>
              <div className="flex gap-4 mt-3">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                  <p className="text-2xl font-bold">{hostel.totalRooms}</p>
                  <p className="text-xs text-green-100">Total Rooms</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                  <p className="text-2xl font-bold">
                    {hostel.rooms?.reduce((acc: number, room: any) => acc + room.occupants.length, 0) || 0}
                  </p>
                  <p className="text-xs text-green-100">Total Students</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowRoomModal(true)}
              className="px-6 py-3 bg-white text-green-600 font-bold rounded-xl hover:bg-green-50 transition transform hover:scale-105 shadow-lg flex items-center gap-2"
            >
              <span className="text-xl">+</span> Add Room
            </button>
          </div>
        </div>
      </div>

      {/* Rooms Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {hostel.rooms.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-md">
            <FaDoorOpen className="text-6xl text-green-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-black mb-2">No Rooms Yet</h3>
            <p className="text-gray-600 mb-6">Start by adding rooms to this hostel</p>
            <button
              onClick={() => setShowRoomModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-teal-700 transition"
            >
              Add Your First Room
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {hostel.rooms.map((room: any) => (
              <div key={room._id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
                <div className="bg-gradient-to-r from-green-500 to-teal-500 p-4 text-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-2xl font-bold">Room {room.roomNumber}</h3>
                      <p className="text-green-100 mt-1">
                        {room.occupants.length}/{room.capacity} Students
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedRoomId(room._id);
                          setShowOccupantModal(true);
                        }}
                        disabled={room.occupants.length >= room.capacity}
                        className="px-3 py-1.5 bg-white/20 backdrop-blur-sm text-white text-sm rounded-lg hover:bg-white/30 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                      >
                        + Add
                      </button>
                      <button
                        onClick={() => handleDeleteRoom(room._id)}
                        className="px-3 py-1.5 bg-red-500/80 backdrop-blur-sm text-white text-sm rounded-lg hover:bg-red-600 transition font-semibold"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  {room.occupants.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-400 text-sm">No students yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {room.occupants.map((occupant: any) => (
                        <div key={occupant._id} className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border-2 border-gray-200 hover:border-green-300 transition">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-bold text-black text-lg">{occupant.name}</h4>
                              <p className="text-sm text-gray-600">{occupant.phone}</p>
                              {occupant.email && <p className="text-xs text-gray-500">{occupant.email}</p>}
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-green-600">₹{occupant.rent}</p>
                              <p className="text-xs text-gray-500">per month</p>
                            </div>
                          </div>
                          <div className="flex gap-2 mt-3">
                            <button
                              onClick={() => handleTogglePayment(room._id, occupant._id, occupant.isPaid)}
                              className={`flex-1 px-3 py-2 text-sm rounded-lg font-bold transition transform hover:scale-105 ${
                                occupant.isPaid
                                  ? 'bg-green-500 text-white shadow-md'
                                  : 'bg-yellow-400 text-black shadow-md'
                              }`}
                            >
                              {occupant.isPaid ? '✓ Paid' : 'Mark as Paid'}
                            </button>
                            <button
                              onClick={() => handleRemoveOccupant(room._id, occupant._id)}
                              className="px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 font-semibold transition"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Room Modal */}
      {showRoomModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 transform transition-all">
            <div className="text-center mb-6">
              <FaDoorOpen className="text-5xl text-green-600 mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-black">Add New Room</h3>
            </div>
            <form onSubmit={handleAddRoom} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-black mb-2">Room Number</label>
                <input
                  type="text"
                  placeholder="e.g., 101, A1, B2"
                  value={roomNumber}
                  onChange={e => setRoomNumber(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-black font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-black mb-2">Capacity (Number of Beds)</label>
                <input
                  type="number"
                  placeholder="e.g., 2, 4, 6"
                  value={capacity}
                  onChange={e => setCapacity(e.target.value)}
                  required
                  min="1"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-black font-medium"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowRoomModal(false)}
                  className="flex-1 py-3 bg-gray-200 text-black font-bold rounded-xl hover:bg-gray-300 transition transform hover:scale-105"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white font-bold rounded-xl hover:from-green-700 hover:to-teal-700 transition transform hover:scale-105 shadow-lg"
                >
                  Add Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      {showOccupantModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 transform transition-all">
            <div className="text-center mb-6">
              <FaUserPlus className="text-5xl text-green-600 mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-black">Add Student</h3>
            </div>
            <form onSubmit={handleAddOccupant} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-black mb-2">Full Name</label>
                <input
                  type="text"
                  placeholder="Enter student name"
                  value={occupantName}
                  onChange={e => setOccupantName(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-black font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-black mb-2">Phone Number</label>
                <input
                  type="tel"
                  placeholder="Enter phone number"
                  value={occupantPhone}
                  onChange={e => setOccupantPhone(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-black font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-black mb-2">Email (Optional)</label>
                <input
                  type="email"
                  placeholder="Enter email address"
                  value={occupantEmail}
                  onChange={e => setOccupantEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-black font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-black mb-2">Monthly Rent (₹)</label>
                <input
                  type="number"
                  placeholder="e.g., 5000"
                  value={rent}
                  onChange={e => setRent(e.target.value)}
                  required
                  min="0"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-black font-medium"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowOccupantModal(false)}
                  className="flex-1 py-3 bg-gray-200 text-black font-bold rounded-xl hover:bg-gray-300 transition transform hover:scale-105"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white font-bold rounded-xl hover:from-green-700 hover:to-teal-700 transition transform hover:scale-105 shadow-lg"
                >
                  Add Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
