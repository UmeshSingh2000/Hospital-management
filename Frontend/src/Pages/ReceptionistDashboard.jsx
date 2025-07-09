import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AvailableBeds from '../Component/AvailableBeds';
import OccupiedBeds from '../Component/OccupiedBeds';
import ManageAppointment from '../Component/ManageAppointment';
import {
  Menu, X, ClipboardList, BedDouble, XCircle, LogOut, Settings
} from 'lucide-react';

const ReceptionistDashboard = () => {
  const [view, setView] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const isActive = (menu) =>
    view === menu
      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md transform scale-105'
      : 'hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 text-gray-700 hover:text-blue-700 hover:shadow-md';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/');
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Top bar for mobile */}
      <div className="md:hidden bg-white/80 backdrop-blur-lg shadow-lg px-6 py-4 flex justify-between items-center border-b border-gray-200/50">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
            <Settings className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Receptionist Panel
          </h2>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-blue-50 transition-colors"
        >
          {sidebarOpen ? <X className="w-6 h-6 text-gray-600" /> : <Menu className="w-6 h-6 text-gray-600" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        md:block ${sidebarOpen ? 'block' : 'hidden'}
        w-full md:w-80
        bg-white/90 backdrop-blur-lg
        border-r border-gray-200/50
        shadow-2xl md:shadow-lg
        h-screen md:sticky md:top-0
        flex flex-col z-10
      `}>
        {/* Scrollable middle content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Title */}
          <div className="hidden md:block mb-8">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Receptionist Panel
                </h2>
                <p className="text-sm text-gray-500">Daily Hospital Tasks</p>
              </div>
            </div>
          </div>

          {/* Navigation buttons */}
          <div className="space-y-3">
            <button
              onClick={() => setView('appointments')}
              className={`w-full text-left px-4 py-3 rounded-xl flex items-center space-x-3 ${isActive('appointments')}`}
            >
              <div className="p-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 shadow-sm">
                <ClipboardList className="w-5 h-5 text-white" />
              </div>
              <span className="font-medium">Manage Appointments</span>
            </button>

            <button
              onClick={() => setView('availableBeds')}
              className={`w-full text-left px-4 py-3 rounded-xl flex items-center space-x-3 ${isActive('availableBeds')}`}
            >
              <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 shadow-sm">
                <BedDouble className="w-5 h-5 text-white" />
              </div>
              <span className="font-medium">Available Beds</span>
            </button>

            <button
              onClick={() => setView('occupiedBeds')}
              className={`w-full text-left px-4 py-3 rounded-xl flex items-center space-x-3 ${isActive('occupiedBeds')}`}
            >
              <div className="p-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-600 shadow-sm">
                <XCircle className="w-5 h-5 text-white" />
              </div>
              <span className="font-medium">Occupied Beds</span>
            </button>
          </div>
        </div>

        {/* Logout at bottom */}
        <div className="p-6 border-t border-gray-200/40">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-3 bg-gradient-to-r from-red-50 to-pink-50 hover:from-red-100 hover:to-pink-100 text-red-700 rounded-xl font-medium transition-all duration-200 shadow-sm hover:shadow-md border border-red-200/50 flex items-center space-x-3"
          >
            <div className="p-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg">
              <LogOut className="w-4 h-4 text-white" />
            </div>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-10 bg-gradient-to-br from-gray-100 to-blue-100 overflow-y-auto">
        <div className="bg-white/70 backdrop-blur-lg p-4 md:p-8 rounded-2xl shadow-2xl border border-white/20">
          {view === 'appointments' && <ManageAppointment />}
          {view === 'availableBeds' && <AvailableBeds />}
          {view === 'occupiedBeds' && <OccupiedBeds />}
          {view === 'home' && (
            <div className="text-gray-700 text-lg text-center">
              Welcome to the <span className="font-semibold text-blue-700">Receptionist Dashboard</span>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ReceptionistDashboard;
