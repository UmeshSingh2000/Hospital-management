import { useState } from 'react';
import FloorForm from '../Component/FloorForm';
import RoomForm from '../Component/RoomForm';
import BedForm from '../Component/BedForm';
import { useNavigate } from 'react-router-dom'; // if using react-router

const AdminDashboard = () => {
  const [view, setView] = useState('floor');
  const [infrastructureOpen, setInfrastructureOpen] = useState(true);
  const navigate = useNavigate(); // for redirection on logout

  const isActive = (menu) =>
    view === menu
      ? 'bg-blue-600 text-white font-medium'
      : 'hover:bg-blue-100 text-gray-700';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/'); // Redirect to login page
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-gray-200 shadow-sm p-4 sticky top-0 h-screen flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold text-blue-700 mb-6 px-2">🛠 Admin Panel</h2>

          {/* Manage Infrastructure Menu */}
          <div>
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
        </div>

        {/* Logout Button */}
        <div className="mt-8">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-md font-medium transition"
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 bg-gray-100 overflow-y-auto">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          {view === 'floor' && <FloorForm />}
          {view === 'room' && <RoomForm />}
          {view === 'bed' && <BedForm />}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
