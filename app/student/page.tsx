"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { FaMapMarkerAlt, FaFileAlt } from 'react-icons/fa';

export default function StudentDashboard() {
  const [user, setUser] = useState<any>(null);
  const [hostels, setHostels] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [notices, setNotices] = useState([]);
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [complaintTitle, setComplaintTitle] = useState('');
  const [complaintDesc, setComplaintDesc] = useState('');
  const [complaintCategory, setComplaintCategory] = useState('maintenance');
  const router = useRouter();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || 'null');
    if (!userData) {
      router.replace('/login');
      return;
    }
    if (userData.role !== 'student') {
      router.replace('/hostels');
      return;
    }
    setUser(userData);
    fetchData();
  }, []);

  const fetchData = async () => {
    // Fetch available hostels
    const hostelRes = await fetch('/api/addhostel');
    const hostelData = await hostelRes.json();
    setHostels(hostelData.hostels || []);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    toast.success('Logged out successfully!');
    setTimeout(() => router.replace('/login'), 500);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Toaster position="top-center" />
      
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-black">Student Portal</h1>
              <p className="text-sm text-gray-700">Welcome, {user.name}!</p>
              {user.studentId && <p className="text-xs text-gray-600">ID: {user.studentId}</p>}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowComplaintModal(true)}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition flex items-center gap-2"
              >
                <FaFileAlt /> Submit Complaint
              </button>
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
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="text-4xl mb-2">🏢</div>
            <p className="text-2xl font-bold text-black">{hostels.length}</p>
            <p className="text-sm text-gray-600">Available Hostels</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="text-4xl mb-2">📋</div>
            <p className="text-2xl font-bold text-black">{complaints.length}</p>
            <p className="text-sm text-gray-600">My Complaints</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="text-4xl mb-2">📢</div>
            <p className="text-2xl font-bold text-black">{notices.length}</p>
            <p className="text-sm text-gray-600">Notices</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="text-4xl mb-2">💰</div>
            <p className="text-2xl font-bold text-black">₹0</p>
            <p className="text-sm text-gray-600">Pending Payment</p>
          </div>
        </div>

        {/* Available Hostels */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-black mb-4">Browse Available Hostels</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hostels.map((h: any) => (
              <div key={h._id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition">
                <div className="bg-gradient-to-r from-indigo-500 to-blue-500 p-6 text-white">
                  <h3 className="text-xl font-bold mb-2">{h.name}</h3>
                  <p className="text-indigo-100 flex items-center gap-2">
                    <FaMapMarkerAlt /> {h.address}
                  </p>
                </div>
                <div className="p-6">
                  <div className="flex justify-between mb-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-indigo-600">{h.totalRooms || 0}</p>
                      <p className="text-xs text-gray-600">Total Rooms</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">
                        {h.rooms?.filter((r: any) => r.occupants.length < r.capacity).length || 0}
                      </p>
                      <p className="text-xs text-gray-600">Available</p>
                    </div>
                  </div>
                  <button
                    onClick={() => router.push(`/student/browse/${h._id}`)}
                    className="w-full py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-blue-700 transition"
                  >
                    View Details →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Notices */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-black mb-4">📢 Recent Notices</h2>
          {notices.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No notices available</p>
          ) : (
            <div className="space-y-3">
              {notices.map((notice: any) => (
                <div key={notice._id} className="border-l-4 border-indigo-500 pl-4 py-2">
                  <h3 className="font-bold text-black">{notice.title}</h3>
                  <p className="text-sm text-gray-700">{notice.content}</p>
                  <p className="text-xs text-gray-500 mt-1">{new Date(notice.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Complaint Modal */}
      {showComplaintModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8">
            <div className="text-center mb-6">
              <FaFileAlt className="text-5xl text-orange-600 mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-black">Submit Complaint</h3>
            </div>
            <form className="space-y-4" onSubmit={(e) => {
              e.preventDefault();
              toast.success('Complaint submitted!');
              setShowComplaintModal(false);
              setComplaintTitle('');
              setComplaintDesc('');
            }}>
              <div>
                <label className="block text-sm font-bold text-black mb-2">Category</label>
                <select
                  value={complaintCategory}
                  onChange={e => setComplaintCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:ring-2 focus:ring-orange-500 outline-none text-black"
                >
                  <option value="maintenance">Maintenance</option>
                  <option value="cleanliness">Cleanliness</option>
                  <option value="security">Security</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-black mb-2">Title</label>
                <input
                  type="text"
                  placeholder="Brief complaint title"
                  value={complaintTitle}
                  onChange={e => setComplaintTitle(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:ring-2 focus:ring-orange-500 outline-none text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-black mb-2">Description</label>
                <textarea
                  placeholder="Describe your complaint..."
                  value={complaintDesc}
                  onChange={e => setComplaintDesc(e.target.value)}
                  required
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:ring-2 focus:ring-orange-500 outline-none text-black"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowComplaintModal(false)}
                  className="flex-1 py-3 bg-gray-200 text-black font-bold rounded-xl hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold rounded-xl hover:from-orange-700 hover:to-red-700 transition"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
