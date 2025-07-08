import { useState } from 'react';
import FloorForm from '../Component/FloorForm';
import RoomForm from '../Component/RoomForm';
import BedForm from '../Component/BedForm';
import Users from '../Component/Users';
import { useNavigate } from 'react-router-dom';
import CreateUser from '../Component/CreateUser';
import { Menu } from 'lucide-react';

const AdminDashboard = () => {
  const [view, setView] = useState('floor');
  const [infrastructureOpen, setInfrastructureOpen] = useState(true);
  const [usersOpen, setUsersOpen] = useState(false);
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
        <h2 className="text-xl font-bold text-blue-700">🛠 Admin Panel</h2>
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          <Menu className="text-blue-700" />
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`md:block ${sidebarOpen ? 'block' : 'hidden'} w-full md:w-72 bg-white border-r border-gray-200 shadow-sm p-4 sticky top-0 h-screen md:h-auto flex flex-col justify-between z-10`}>
        <div className="overflow-y-auto">
          {/* Title for desktop */}
          <h2 className="hidden md:block text-2xl font-bold text-blue-700 mb-6 px-2">🛠 Admin Panel</h2>

          {/* Manage Infrastructure */}
          <div className="mb-4">
            <button
              onClick={() => setInfrastructureOpen(!infrastructureOpen)}
              className="w-full flex justify-between items-center text-left px-4 py-2 rounded-md bg-blue-100 hover:bg-blue-200 text-blue-800 font-semibold transition"
            >
              <span>Manage Infrastructure</span>
              <span className="text-sm">{infrastructureOpen ? '▲' : '▼'}</span>
            </button>

            {infrastructureOpen && (
              <div className="mt-3 ml-2 space-y-2">
                <button
                  onClick={() => setView('floor')}
                  className={`w-full text-left px-4 py-2 rounded-md transition ${isActive('floor')}`}
                >
                  ➕ Create Floor
                </button>
                <button
                  onClick={() => setView('room')}
                  className={`w-full text-left px-4 py-2 rounded-md transition ${isActive('room')}`}
                >
                  🏠 Create Room
                </button>
                <button
                  onClick={() => setView('bed')}
                  className={`w-full text-left px-4 py-2 rounded-md transition ${isActive('bed')}`}
                >
                  🛏️ Create Bed
                </button>
              </div>
            )}
          </div>

          {/* Manage Users */}
          <div>
            <button
              onClick={() => setUsersOpen(!usersOpen)}
              className="w-full flex justify-between items-center text-left px-4 py-2 rounded-md bg-blue-100 hover:bg-blue-200 text-blue-800 font-semibold transition"
            >
              <span>Manage Users</span>
              <span className="text-sm">{usersOpen ? '▲' : '▼'}</span>
            </button>

            {usersOpen && (
              <div className="mt-3 ml-2 space-y-2">
                <button
                  onClick={() => setView('users')}
                  className={`w-full text-left px-4 py-2 rounded-md transition ${isActive('users')}`}
                >
                  👥 View All Users
                </button>
                <button
                  onClick={() => setView('createUser')}
                  className={`w-full text-left px-4 py-2 rounded-md transition ${isActive('createUser')}`}
                >
                  ➕ Create User
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Logout */}
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
