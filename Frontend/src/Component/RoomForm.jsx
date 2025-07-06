import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { BedDouble, Home, Building2 } from 'lucide-react'; // Optional icons

const RoomForm = () => {
  const [roomNumber, setRoomNumber] = useState('');
  const [type, setType] = useState('');
  const [floorId, setFloorId] = useState('');
  const [numberOfBeds, setNumberOfBeds] = useState('');
  const [rooms, setRooms] = useState([]);
  const [floors, setFloors] = useState([]);

  const fetchFloors = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/getAllFloors`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setFloors(res.data.floors || []);
    } catch (error) {
      console.error('Error fetching floors:', error.message);
    }
  };

  const fetchRooms = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/getAllRooms`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (res.status === 200) {
        setRooms(res.data.rooms || []);
      }
    } catch (error) {
      toast.error('Failed to fetch rooms');
    }
  };

  useEffect(() => {
    fetchRooms();
    fetchFloors();
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!roomNumber || !type || !floorId || !numberOfBeds) {
      toast.error('Please fill all fields');
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/admin/createRoom`,
        {
          roomNumber,
          type,
          floorId,
          numberOfBeds: parseInt(numberOfBeds),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (res.status === 201) {
        toast.success(res.data.message);
        setRoomNumber('');
        setType('');
        setFloorId('');
        setNumberOfBeds('');
        fetchRooms(); // refresh list
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || 'Error creating room');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      {/* Room Creation Form */}
      <div className="bg-white p-6 shadow-md border rounded-lg">
        <h3 className="text-2xl font-bold text-blue-800 mb-6">🏠 Create Room</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Room Number"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={roomNumber}
            onChange={e => setRoomNumber(e.target.value)}
          />

          <select
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={type}
            onChange={e => setType(e.target.value)}
          >
            <option value="">Select Room Type</option>
            <option value="General">General</option>
            <option value="Semi-Private">Semi-Private</option>
            <option value="Private">Private</option>
            <option value="ICU">ICU</option>
            <option value="Operation Theater">Operation Theater</option>
          </select>

          <select
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={floorId}
            onChange={e => setFloorId(e.target.value)}
          >
            <option value="">Select Floor</option>
            {floors.map(floor => (
              <option key={floor._id} value={floor._id}>
                Floor {floor.floorNumber}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Total Occupancy (Number of Beds)"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={numberOfBeds}
            onChange={e => setNumberOfBeds(e.target.value)}
          />

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition"
          >
            Create Room
          </button>
        </form>
      </div>

      {/* Display All Rooms */}
      <div className="bg-white p-6 shadow-md border rounded-lg">
        <h3 className="text-2xl font-bold text-blue-800 mb-6">🏢 All Rooms</h3>
        {rooms.length === 0 ? (
          <p className="text-gray-500">No rooms found.</p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {rooms.map((room) => (
              <li
                key={room._id}
                className="border p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition flex flex-col gap-1"
              >
                <div className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Home className="w-5 h-5 text-blue-500" />
                  Room: {room.roomNumber}
                </div>
                <p className="text-sm text-gray-600">Type: {room.type}</p>
                <p className="text-sm text-gray-600">
                  Floor: {room.floorId.floorNumber}
                </p>
                <p className="text-sm text-gray-600">
                  Beds: {room.totalBedOccupancy || room.numberOfBeds}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default RoomForm;
