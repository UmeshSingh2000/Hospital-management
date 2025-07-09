import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { BedDouble, Layers, Plus, Loader2 } from 'lucide-react';

const BedForm = () => {
  const [bedNumber, setBedNumber] = useState('');
  const [roomId, setRoomId] = useState('');
  const [rooms, setRooms] = useState([]);
  const [beds, setBeds] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchRooms = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/getAllRooms`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setRooms(res.data.rooms || []);
    } catch (error) {
      toast.error('Failed to fetch rooms');
    }
  };

  const fetchBeds = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/getAllBeds`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setBeds(res.data || []);
    } catch (error) {
      toast.error('Failed to fetch beds');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
    fetchBeds();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!bedNumber || !roomId) {
      toast.error('Please fill all fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/admin/createBed`,
        { bedNumber, roomId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (res.status === 201) {
        toast.success('Bed created successfully');
        setBedNumber('');
        setRoomId('');
        fetchBeds();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error creating bed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      {/* Create Bed Form */}
      <div className="bg-white/80 backdrop-blur-lg p-8 shadow-xl rounded-2xl border border-white/20">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg">
            <Plus className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-800">Create New Bed</h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Bed Number</label>
            <input
              type="text"
              placeholder="Enter bed number"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 bg-white/50 hover:bg-white/70"
              value={bedNumber}
              onChange={(e) => setBedNumber(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Select Room</label>
            <select
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 bg-white/50 hover:bg-white/70"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              disabled={isSubmitting}
            >
              <option value="">Select Room</option>
              {rooms.map((room) => (
                <option key={room._id} value={room._id}>
                  Room {room.roomNumber} - {room.type} - Floor {room.floorId?.floorNumber}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !bedNumber || !roomId}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed transform hover:scale-105 disabled:transform-none flex items-center justify-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Creating Bed...</span>
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                <span>Create Bed</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* All Beds Section */}
      <div className="bg-white/80 backdrop-blur-lg p-8 shadow-xl rounded-2xl border border-white/20">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-lg">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-800">All Beds</h3>
          <div className="ml-auto">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
              {beds.length} Bed{beds.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-3 text-gray-600">Loading beds...</span>
          </div>
        ) : beds.length === 0 ? (
          <div className="text-center py-12">
            <div className="p-4 bg-gradient-to-r from-gray-100 to-blue-50 rounded-xl inline-block mb-4">
              <BedDouble className="w-12 h-12 text-gray-400 mx-auto" />
            </div>
            <p className="text-gray-500 text-lg">No beds added yet.</p>
            <p className="text-gray-400 text-sm mt-2">Add a bed using the form above.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {beds.map((bed, index) => (
              <div
                key={bed._id}
                className="group flex items-start gap-4 border border-gray-200 p-6 rounded-xl bg-gradient-to-r from-gray-50 to-blue-50 hover:from-blue-50 hover:to-purple-50 transition-all duration-200 hover:shadow-lg hover:border-blue-300 transform hover:scale-105"
              >
                <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg group-hover:shadow-xl transition-all duration-200">
                  <BedDouble className="text-white w-6 h-6" />
                </div>

                <div className="flex-1">
                  <p className="text-lg font-bold text-gray-800 mb-1">
                    Bed {bed.bedNumber}
                  </p>
                  <p className="text-sm text-gray-600">
                    Room: {bed.roomId.roomNumber || 'N/A'} ({bed.roomId?.type || 'N/A'})
                  </p>
                  <p className="text-sm text-gray-500">
                    Floor: {bed.roomId.floorId.floorNumber}
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-xs text-gray-400 mb-1">#{index + 1}</div>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BedForm;
