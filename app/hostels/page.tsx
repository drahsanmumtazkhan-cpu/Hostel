"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { FaMapMarkerAlt, FaEdit, FaTrash, FaStar, FaHotel } from 'react-icons/fa';

export default function HostelsPage() {
  const [hostels, setHostels] = useState([]);
  const [wardens, setWardens] = useState([]);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [selectedWarden, setSelectedWarden] = useState('');
  const [owner, setOwner] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [userName, setUserName] = useState('');
  const [isPremium, setIsPremium] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [editingHostel, setEditingHostel] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user) {
      router.replace('/login');
      return;
    }
    if (user.role === 'student') {
      router.replace('/student');
      return;
    }
    setOwner(user.username);
    setUserName(user.name);
    setIsPremium(user.isPremium || false);
    fetchHostels(user.username); // Pass username directly
    fetchWardens();
  }, []);

  const fetchWardens = async () => {
    const res = await fetch('/api/wardens');
    const data = await res.json();
    setWardens(data.wardens || []);
  };

  const fetchHostels = async (username?: string) => {
    const currentOwner = username || owner;
    if (!currentOwner) return; // Don't fetch if no owner yet
    
    const res = await fetch('/api/addhostel');
    const data = await res.json();
    // Filter to show only user's own hostels
    const userHostels = (data.hostels || []).filter((h: any) => h.owner === currentOwner);
    setHostels(userHostels);
  };

  const handleAddHostel = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/addhostel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, address, owner, warden: selectedWarden || null }),
    });
    const data = await res.json();
    if (res.ok) {
      toast.success('Hostel added successfully!');
      setName('');
      setAddress('');
      setSelectedWarden('');
      setShowModal(false);
      fetchHostels();
    } else {
      toast.error(data.error || 'Failed to add hostel');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/change-password', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: owner, oldPassword, newPassword }),
    });
    const data = await res.json();
    if (res.ok) {
      toast.success('Password changed successfully!');
      setOldPassword('');
      setNewPassword('');
      setShowPasswordModal(false);
    } else {
      toast.error(data.error || 'Failed to change password');
    }
  };

  const handleGetPremium = async () => {
    const res = await fetch('/api/premium', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: owner }),
    });
    const data = await res.json();
    if (res.ok) {
      toast.success('Premium activated! 🎉');
      setIsPremium(true);
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      user.isPremium = true;
      localStorage.setItem('user', JSON.stringify(user));
      setShowPremiumModal(false);
    } else {
      toast.error(data.error || 'Failed to activate premium');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    toast.success('Logged out successfully!');
    setTimeout(() => router.replace('/login'), 500);
  };

  const handleEditHostel = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/addhostel', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: editingHostel._id, name, address, warden: selectedWarden || null }),
    });
    const data = await res.json();
    if (res.ok) {
      toast.success('Hostel updated successfully!');
      setName('');
      setAddress('');
      setSelectedWarden('');
      setEditingHostel(null);
      setShowEditModal(false);
      fetchHostels();
    } else {
      toast.error(data.error || 'Failed to update hostel');
    }
  };

  const handleDeleteHostel = async (id: string) => {
    if (!confirm('Are you sure you want to delete this hostel?')) return;
    const res = await fetch('/api/addhostel', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      toast.success('Hostel deleted successfully!');
      fetchHostels();
    } else {
      toast.error('Failed to delete hostel');
    }
  };

  const openEditModal = (hostel: any) => {
    setEditingHostel(hostel);
    setName(hostel.name);
    setAddress(hostel.address);
    setSelectedWarden(hostel.warden || '');
    setShowEditModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Toaster position="top-center" />
      
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-black">Hostel Management</h1>
              <p className="text-sm text-gray-700">
                Welcome, {userName}! 
                {isPremium && <span className="ml-2 px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-black text-xs font-bold rounded-full inline-flex items-center gap-1"><FaStar /> PREMIUM</span>}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowPasswordModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Change Password
              </button>
              {!isPremium && (
                <button
                  onClick={() => setShowPremiumModal(true)}
                  className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-semibold rounded-lg hover:from-yellow-600 hover:to-orange-600 transition"
                >
                  Get Premium
                </button>
              )}
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-black">My Hostels</h2>
            <p className="text-gray-700 mt-1">Manage all your hostel properties</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold rounded-lg shadow-lg hover:from-indigo-700 hover:to-blue-700 transition transform hover:scale-105 flex items-center gap-2"
          >
            <span className="text-xl">+</span> Add New Hostel
          </button>
        </div>

        {/* Hostels Grid */}
        {hostels.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-md">
            <div className="text-6xl mb-4">🏢</div>
            <h3 className="text-2xl font-bold text-black mb-2">No Hostels Yet</h3>
            <p className="text-gray-600 mb-6">Start by adding your first hostel property</p>
            <button
              onClick={() => setShowModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-blue-700 transition"
            >
              Add Your First Hostel
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hostels.map((h: any) => (
              <div key={h._id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group">
                <div className="bg-gradient-to-r from-indigo-500 to-blue-500 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">{h.name}</h3>
                  <p className="text-indigo-100 text-sm flex items-center gap-2">
                    <FaMapMarkerAlt /> {h.address}
                  </p>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="bg-indigo-50 rounded-lg p-3">
                        <p className="text-2xl font-bold text-indigo-600">{h.totalRooms || 0}</p>
                        <p className="text-xs text-gray-600">Rooms</p>
                      </div>
                      <div className="bg-green-50 rounded-lg p-3">
                        <p className="text-2xl font-bold text-green-600">
                          {h.rooms?.reduce((acc: number, room: any) => acc + room.occupants.length, 0) || 0}
                        </p>
                        <p className="text-xs text-gray-600">Occupants</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => router.push(`/hostels/${h._id}`)}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-blue-700 transition transform hover:scale-105 shadow-md"
                    >
                      Manage →
                    </button>
                    <button
                      onClick={() => openEditModal(h)}
                      className="px-4 py-3 bg-yellow-500 text-white font-semibold rounded-xl hover:bg-yellow-600 transition transform hover:scale-105 shadow-md"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteHostel(h._id)}
                      className="px-4 py-3 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition transform hover:scale-105 shadow-md"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Hostel Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8">
            <h3 className="text-2xl font-bold text-black mb-6">Add New Hostel</h3>
            <form onSubmit={handleAddHostel} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black mb-1">Hostel Name</label>
                <input
                  type="text"
                  placeholder="Enter hostel name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">Address</label>
                <input
                  type="text"
                  placeholder="Enter address"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">Assign Warden (Optional)</label>
                <select
                  value={selectedWarden}
                  onChange={e => setSelectedWarden(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition text-black"
                >
                  <option value="">No Warden</option>
                  {wardens.map((warden: any) => (
                    <option key={warden.username} value={warden.username}>
                      {warden.name} ({warden.username})
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 pt-4">\n                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 bg-gray-200 text-black font-semibold rounded-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-blue-700 transition"
                >
                  Add Hostel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8">
            <h3 className="text-2xl font-bold text-black mb-6">Change Password</h3>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black mb-1">Old Password</label>
                <input
                  type="password"
                  placeholder="Enter old password"
                  value={oldPassword}
                  onChange={e => setOldPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">New Password</label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-black"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordModal(false);
                    setOldPassword('');
                    setNewPassword('');
                  }}
                  className="flex-1 py-3 bg-gray-200 text-black font-semibold rounded-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition"
                >
                  Change Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Premium Modal */}
      {showPremiumModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8">
            <div className="text-center">
              <FaStar className="text-6xl text-yellow-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-black mb-4">Upgrade to Premium</h3>
              <p className="text-black mb-6">
                Get access to exclusive features and priority support!
              </p>
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-6 mb-6">
                <ul className="text-left space-y-2 text-black">
                  <li>✓ Unlimited hostel listings</li>
                  <li>✓ Advanced analytics</li>
                  <li>✓ Priority support</li>
                  <li>✓ Ad-free experience</li>
                </ul>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowPremiumModal(false)}
                  className="flex-1 py-3 bg-gray-200 text-black font-semibold rounded-lg hover:bg-gray-300 transition"
                >
                  Maybe Later
                </button>
                <button
                  onClick={handleGetPremium}
                  className="flex-1 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold rounded-lg hover:from-yellow-600 hover:to-orange-600 transition transform hover:scale-105"
                >
                  Activate Now (Demo)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Hostel Modal */}
      {showEditModal && editingHostel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8">
            <h3 className="text-2xl font-bold text-black mb-6">Edit Hostel</h3>
            <form onSubmit={handleEditHostel} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black mb-1">Hostel Name</label>
                <input
                  type="text"
                  placeholder="Enter hostel name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">Address</label>
                <input
                  type="text"
                  placeholder="Enter address"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">Assign Warden (Optional)</label>
                <select
                  value={selectedWarden}
                  onChange={e => setSelectedWarden(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition text-black"
                >
                  <option value="">No Warden</option>
                  {wardens.map((warden: any) => (
                    <option key={warden.username} value={warden.username}>
                      {warden.name} ({warden.username})
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 pt-4">\n                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingHostel(null);
                    setName('');
                    setAddress('');
                  }}
                  className="flex-1 py-3 bg-gray-200 text-black font-semibold rounded-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 text-white font-semibold rounded-lg hover:from-yellow-700 hover:to-orange-700 transition"
                >
                  Update Hostel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
