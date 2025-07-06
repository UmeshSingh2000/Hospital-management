import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { BedDouble, LayoutTemplate } from 'lucide-react'; // Optional icons

const BedForm = () => {
  const [bedNumber, setBedNumber] = useState('');
  const [roomId, setRoomId] = useState('');
  const [rooms, setRooms] = useState([]);
  const [beds, setBeds] = useState([]);

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
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/getAllBeds`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setBeds(res.data || []);
    } catch (error) {
      toast.error('Failed to fetch beds');
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
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      {/* Create Bed Form */}
      <div className="bg-white p-6 shadow-md border rounded-lg">
        <h3 className="text-2xl font-bold text-blue-800 mb-6">🛏️ Create Bed</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Enter Bed Number"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={bedNumber}
            onChange={(e) => setBedNumber(e.target.value)}
          />

          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          >
            <option value="">Select Room</option>
            {rooms.map((room) => (
              <option key={room._id} value={room._id}>
                Room {room.roomNumber} - {room.type} - Floor {room.floorId?.floorNumber}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition"
          >
            Create Bed
          </button>
        </form>
      </div>

      {/* List All Beds */}
      <div className="bg-white p-6 shadow-md border rounded-lg">
        <h3 className="text-2xl font-bold text-blue-800 mb-6">🛏️ All Beds</h3>
        {beds.length === 0 ? (
          <p className="text-gray-500">No beds found.</p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {beds.map((bed) => (
              <li
                key={bed._id}
                className="border p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition space-y-1"
              >
                <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                  <BedDouble className="text-blue-500 w-5 h-5" />
                  Bed: {bed.bedNumber}
                </div>
                <p className="text-sm text-gray-600">
                  Room: {bed.roomId?.roomNumber || 'N/A'} ({bed.roomId?.type || 'N/A'})
                </p>
                <p className="text-sm text-gray-500">
                  Floor: {bed.roomId.floorId.floorNumber}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default BedForm;
