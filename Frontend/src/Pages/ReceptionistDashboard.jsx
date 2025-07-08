import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AvailableBeds from '../Component/AvailableBeds';
import OccupiedBeds from '../Component/OccupiedBeds';
import ManageAppointment from '../Component/ManageAppointment';
import { Menu } from 'lucide-react';

const ReceptionistDashboard = () => {
  const [view, setView] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const isActive = (menu) =>
    view === menu
      ? 'bg-blue-600 text-white font-medium'
      : 'hover:bg-blue-100 text-gray-700';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/');
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Top bar for mobile */}
      <div className="md:hidden bg-white shadow-sm px-4 py-3 flex justify-between items-center border-b border-gray-200">
        <h2 className="text-xl font-bold text-blue-700">📋 Receptionist Panel</h2>
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          <Menu className="text-blue-700" />
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`md:block ${sidebarOpen ? 'block' : 'hidden'} w-full md:w-72 bg-white border-r border-gray-200 shadow-sm p-4 sticky top-0 md:h-screen flex flex-col justify-between z-10`}
      >
        <div className="overflow-y-auto">
          <h2 className="hidden md:block text-2xl font-bold text-blue-700 mb-6 px-2">
            📋 Receptionist Panel
          </h2>

          <div className="space-y-2">
            <button
              onClick={() => setView('appointments')}
              className={`w-full text-left px-4 py-2 rounded-md transition ${isActive('appointments')}`}
            >
              📅 Manage Appointments
            </button>

            <button
              onClick={() => setView('availableBeds')}
              className={`w-full text-left px-4 py-2 rounded-md transition ${isActive('availableBeds')}`}
            >
              🛏️ Bed Availability
            </button>

            <button
              onClick={() => setView('occupiedBeds')}
              className={`w-full text-left px-4 py-2 rounded-md transition ${isActive('occupiedBeds')}`}
            >
              🚫 Occupied Beds
            </button>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-md font-medium transition"
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-10 bg-gray-100 overflow-y-auto">
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md border border-gray-200">
          {view === 'appointments' && <ManageAppointment />}
          {view === 'availableBeds' && <AvailableBeds />}
          {view === 'occupiedBeds' && <OccupiedBeds />}
          {view === 'home' && (
            <div className="text-gray-600 text-lg">
              Welcome to the Receptionist Dashboard
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ReceptionistDashboard;
