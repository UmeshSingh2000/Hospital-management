import { useState } from 'react';
import FloorForm from '../Component/FloorForm';
import RoomForm from '../Component/RoomForm';
import BedForm from '../Component/BedForm';
import Users from '../Component/Users';
import CreateUser from '../Component/CreateUser';
import { useNavigate } from 'react-router-dom';
import {
  Menu, X, ChevronDown, ChevronUp, Building, Home,
  Bed, Users as UsersIcon, UserPlus, LogOut, Settings
} from 'lucide-react';

const AdminDashboard = () => {
  const [view, setView] = useState('floor');
  const [infrastructureOpen, setInfrastructureOpen] = useState(true);
  const [usersOpen, setUsersOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const isActive = (menu) =>
    view === menu
      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105'
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
            Admin Panel
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
        h-screen
        md:sticky md:top-0
        flex flex-col z-10
      `}>
        {/* Scrollable Sidebar Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Title for desktop */}
          <div className="hidden md:block mb-8">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Admin Panel
                </h2>
                <p className="text-sm text-gray-500">Management Dashboard</p>
              </div>
            </div>
          </div>

          {/* Manage Infrastructure */}
          <div className="mb-6">
            <button
              onClick={() => setInfrastructureOpen(!infrastructureOpen)}
              className="w-full flex justify-between items-center text-left px-4 py-3 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 border border-blue-200/50 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <span className="font-semibold text-blue-800 flex items-center space-x-2">
                <Building className="w-5 h-5" />
                <span>Manage Infrastructure</span>
              </span>
              {infrastructureOpen ?
                <ChevronUp className="w-5 h-5 text-blue-600" /> :
                <ChevronDown className="w-5 h-5 text-blue-600" />
              }
            </button>
            <div className={`
              overflow-hidden transition-all duration-300 ease-in-out
              ${infrastructureOpen ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'}
            `}>
              <div className="ml-2 space-y-2">
                <button
                  onClick={() => setView('floor')}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center space-x-3 ${isActive('floor')}`}
                >
                  <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 shadow-sm">
                    <Building className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-medium">Create Floor</span>
                </button>
                <button
                  onClick={() => setView('room')}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center space-x-3 ${isActive('room')}`}
                >
                  <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 shadow-sm">
                    <Home className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-medium">Create Room</span>
                </button>
                <button
                  onClick={() => setView('bed')}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center space-x-3 ${isActive('bed')}`}
                >
                  <div className="p-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-600 shadow-sm">
                    <Bed className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-medium">Create Bed</span>
                </button>
              </div>
            </div>
          </div>

          {/* Manage Users */}
          <div>
            <button
              onClick={() => setUsersOpen(!usersOpen)}
              className="w-full flex justify-between items-center text-left px-4 py-3 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 border border-purple-200/50 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <span className="font-semibold text-purple-800 flex items-center space-x-2">
                <UsersIcon className="w-5 h-5" />
                <span>Manage Users</span>
              </span>
              {usersOpen ?
                <ChevronUp className="w-5 h-5 text-purple-600" /> :
                <ChevronDown className="w-5 h-5 text-purple-600" />
              }
            </button>
            <div className={`
              overflow-hidden transition-all duration-300 ease-in-out
              ${usersOpen ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'}
            `}>
              <div className="ml-2 space-y-2">
                <button
                  onClick={() => setView('users')}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center space-x-3 ${isActive('users')}`}
                >
                  <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-600 shadow-sm">
                    <UsersIcon className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-medium">View All Users</span>
                </button>
                <button
                  onClick={() => setView('createUser')}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center space-x-3 ${isActive('createUser')}`}
                >
                  <div className="p-2 rounded-lg bg-gradient-to-r from-indigo-500 to-blue-600 shadow-sm">
                    <UserPlus className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-medium">Create User</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Logout (fixed at bottom) */}
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
          {view === 'floor' && <FloorForm />}
          {view === 'room' && <RoomForm />}
          {view === 'bed' && <BedForm />}
          {view === 'users' && <Users />}
          {view === 'createUser' && <CreateUser />}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
