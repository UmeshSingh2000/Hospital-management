// src/pages/FloorForm.jsx
import { useState, useEffect } from 'react';
import { Building2, Plus, Layers, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FloorForm = () => {
  const [floorNumber, setFloorNumber] = useState('');
  const [floors, setFloors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const fetchFloors = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/getAllFloors`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      setFloors(data.floors || []);
    } catch (error) {
      console.error('Error fetching floors:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFloors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!floorNumber.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/admin/createFloor`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ floorNumber }),
      });

      const data = await response.json();
      if (response.status === 201) {
        setFloorNumber('');
        fetchFloors();
      }
    } catch (error) {
      console.error(error.message || 'Error creating floor');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFloorClick = (floor) => {
  navigate(`/floors/${floor._id}/rooms?floorNumber=${encodeURIComponent(floor.floorNumber)}`);
};

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-10">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center space-x-3">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Floor Management
          </h1>
        </div>
        <p className="text-gray-600">Create and manage building floors</p>
      </div>

      <div className="bg-white/80 backdrop-blur-lg p-8 shadow-xl rounded-2xl border border-white/20">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg">
            <Plus className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-800">Create New Floor</h3>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Floor Number</label>
            <input
              type="text"
              placeholder="Enter floor number (e.g., 1, 2, G, B1)"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              value={floorNumber}
              onChange={(e) => setFloorNumber(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !floorNumber.trim()}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Creating Floor...</span>
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                <span>Create Floor</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-lg p-8 shadow-xl rounded-2xl border border-white/20">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-lg">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-800">All Floors</h3>
          <div className="ml-auto">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
              {floors.length} Floor{floors.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-3 text-gray-600">Loading floors...</span>
          </div>
        ) : (
          <div className="grid gap-4">
            {floors.map((floor, index) => (
              <div
                key={floor._id}
                onClick={() => handleFloorClick(floor)}
                className="cursor-pointer group flex items-center gap-4 border border-gray-200 p-6 rounded-xl bg-gradient-to-r from-gray-50 to-blue-50 hover:from-blue-50 hover:to-purple-50 transition-all duration-200 hover:shadow-lg hover:border-blue-300 transform hover:scale-105"
              >
                <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg group-hover:shadow-xl">
                  <Building2 className="text-white w-6 h-6" />
                </div>

                <div className="flex-1">
                  <p className="text-lg font-bold text-gray-800 mb-1">
                    Floor {floor.floorNumber}
                  </p>
                  <p className="text-sm text-gray-500">
                    {floor.description || 'No description available'}
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-xs text-gray-400 mb-1">Floor #{index + 1}</div>
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FloorForm;
