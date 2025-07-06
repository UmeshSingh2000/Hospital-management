import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Building2 } from 'lucide-react'; // Optional icon, use lucide or react-icons

const FloorForm = () => {
  const [floorNumber, setFloorNumber] = useState('');
  const [floors, setFloors] = useState([]);

  const fetchFloors = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/getAllFloors`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setFloors(res.data.floors || []);
    } catch (error) {
      console.error('Error fetching floors:', error.message);
    }
  };

  useEffect(() => {
    fetchFloors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/admin/createFloor`,
        { floorNumber },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      if (res.status === 201) {
        toast.success(res.data.message);
        setFloorNumber('');
        fetchFloors(); // Refresh list after successful creation
      }
    } catch (error) {
      if (error.response?.status === 400) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.response?.data?.message || 'Error creating floor');
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-10">
      {/* Create Form */}
      <div className="bg-white p-6 shadow-md rounded-lg border border-gray-200">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">➕ Create Floor</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Enter floor number (e.g., 1, 2, G)"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            value={floorNumber}
            onChange={(e) => setFloorNumber(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 transition text-white px-6 py-2 rounded-md font-medium"
          >
            Create Floor
          </button>
        </form>
      </div>

      {/* List of Floors */}
      <div className="bg-white p-6 shadow-md rounded-lg border border-gray-200">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">🏢 All Floors</h3>
        {floors.length === 0 ? (
          <p className="text-gray-500">No floors added yet.</p>
        ) : (
          <ul className="grid gap-4">
            {floors.map((floor) => (
              <li
                key={floor._id}
                className="flex items-center gap-4 border p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition"
              >
                <Building2 className="text-blue-600 w-6 h-6" />
                <div>
                  <p className="text-lg font-semibold text-gray-800">
                    Floor {floor.floorNumber}
                  </p>
                  <p className="text-sm text-gray-500">{floor.description || 'No description'}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default FloorForm;
