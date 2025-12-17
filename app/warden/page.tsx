"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { FaMapMarkerAlt, FaHotel, FaTools, FaUserShield } from 'react-icons/fa';

export default function WardenDashboard() {
  const [hostels, setHostels] = useState([]);
  const [userName, setUserName] = useState('');
  const [userUsername, setUserUsername] = useState('');
  const router = useRouter();

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
    setUserName(user.name);
    setUserUsername(user.username);
    fetchMyHostels(user.username);
  }, []);

  const fetchMyHostels = async (username: string) => {
    const res = await fetch('/api/addhostel');
    const data = await res.json();
    // Filter to show only hostels where this warden is assigned
    const myHostels = (data.hostels || []).filter((h: any) => h.warden === username);
    setHostels(myHostels);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    toast.success('Logged out successfully!');
    setTimeout(() => router.replace('/login'), 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100">
      <Toaster position="top-center" />
      
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-black">Warden Dashboard</h1>
              <p className="text-sm text-gray-700">
                Welcome, {userName}! 
                <span className="ml-2 px-2 py-1 bg-gradient-to-r from-green-400 to-teal-400 text-black text-xs font-bold rounded-full inline-flex items-center gap-1"><FaUserShield /> WARDEN</span>
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-black">My Assigned Hostels</h2>
          <p className="text-gray-700 mt-1">Manage hostels where you are the assigned warden</p>
        </div>

        {hostels.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-md">
            <FaHotel className="text-6xl text-green-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-black mb-2">No Hostels Assigned</h3>
            <p className="text-gray-600 mb-6">You haven't been assigned to any hostels yet</p>
            <p className="text-sm text-gray-500">Contact the admin to get assigned to a hostel</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hostels.map((hostel: any) => (
              <div key={hostel._id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:scale-105">
                <div className="bg-gradient-to-r from-green-500 to-teal-500 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">{hostel.name}</h3>
                  <p className="text-green-50 text-sm flex items-center gap-2">
                    <FaMapMarkerAlt /> {hostel.address}
                  </p>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
                      <p className="text-2xl font-bold text-black">{hostel.totalRooms}</p>
                      <p className="text-xs text-gray-600 mt-1">Total Rooms</p>
                    </div>
                    <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                      <p className="text-2xl font-bold text-black">
                        {hostel.rooms?.reduce((acc: number, room: any) => acc + room.occupants.length, 0) || 0}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">Students</p>
                    </div>
                  </div>
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600">Owner</p>
                    <p className="text-sm font-semibold text-black">{hostel.owner}</p>
                  </div>
                  <button
                    onClick={() => router.push(`/warden/${hostel._id}`)}
                    className="w-full py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white font-bold rounded-xl hover:from-green-700 hover:to-teal-700 transition transform hover:scale-105 shadow-md flex items-center justify-center gap-2"
                  >
                    <FaTools /> Manage Hostel
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
