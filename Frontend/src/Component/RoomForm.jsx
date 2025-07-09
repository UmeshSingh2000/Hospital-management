import { useState, useEffect } from 'react';
import { BedDouble, Home, Building2, Plus, Layers, Loader2 } from 'lucide-react';

const RoomForm = () => {
  const [roomNumber, setRoomNumber] = useState('');
  const [type, setType] = useState('');
  const [floorId, setFloorId] = useState('');
  const [numberOfBeds, setNumberOfBeds] = useState('');
  const [rooms, setRooms] = useState([]);
  const [floors, setFloors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchFloors = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/getAllFloors`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await res.json();
      setFloors(data.floors || []);
    } catch (error) {
      console.error('Error fetching floors:', error.message);
    }
  };

  const fetchRooms = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/getAllRooms`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await res.json();
      if (res.status === 200) {
        setRooms(data.rooms || []);
      }
    } catch (error) {
      console.error('Failed to fetch rooms');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
    fetchFloors();
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!roomNumber || !type || !floorId || !numberOfBeds) {
      console.error('Please fill all fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/admin/createRoom`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          roomNumber,
          type,
          floorId,
          numberOfBeds: parseInt(numberOfBeds),
        }),
      });

      const data = await res.json();

      if (res.status === 201) {
        console.log(data.message);
        setRoomNumber('');
        setType('');
        setFloorId('');
        setNumberOfBeds('');
        fetchRooms(); // refresh list
      }
    } catch (error) {
      console.log(error);
      console.error(error.response?.data?.message || 'Error creating room');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center space-x-3">
          <div className="p-3 bg-gradient-to-r from-green-500 to-teal-600 rounded-xl shadow-lg">
            <Home className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
            Room Management
          </h1>
        </div>
        <p className="text-gray-600">Create and manage hospital rooms</p>
      </div>

      {/* Create Form */}
      <div className="bg-white/80 backdrop-blur-lg p-8 shadow-xl rounded-2xl border border-white/20">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg">
            <Plus className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-800">Create New Room</h3>
        </div>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Room Number</label>
            <input
              type="text"
              placeholder="Enter room number (e.g., 101, 102A, ICU-1)"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm hover:bg-white/70"
              value={roomNumber}
              onChange={e => setRoomNumber(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Room Type</label>
            <select
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm hover:bg-white/70"
              value={type}
              onChange={e => setType(e.target.value)}
              disabled={isSubmitting}
            >
              <option value="">Select Room Type</option>
              <option value="General">General</option>
              <option value="Semi-Private">Semi-Private</option>
              <option value="Private">Private</option>
              <option value="ICU">ICU</option>
              <option value="Operation Theater">Operation Theater</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Floor</label>
            <select
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm hover:bg-white/70"
              value={floorId}
              onChange={e => setFloorId(e.target.value)}
              disabled={isSubmitting}
            >
              <option value="">Select Floor</option>
              {floors.map(floor => (
                <option key={floor._id} value={floor._id}>
                  Floor {floor.floorNumber}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Number of Beds</label>
            <input
              type="number"
              placeholder="Enter total occupancy (number of beds)"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm hover:bg-white/70"
              value={numberOfBeds}
              onChange={e => setNumberOfBeds(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
          
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !roomNumber || !type || !floorId || !numberOfBeds}
            className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed transform hover:scale-105 disabled:transform-none flex items-center justify-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Creating Room...</span>
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                <span>Create Room</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* List of Rooms */}
      <div className="bg-white/80 backdrop-blur-lg p-8 shadow-xl rounded-2xl border border-white/20">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-800">All Rooms</h3>
          <div className="ml-auto">
            <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
              {rooms.length} Room{rooms.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-green-600" />
            <span className="ml-3 text-gray-600">Loading rooms...</span>
          </div>
        ) : rooms.length === 0 ? (
          <div className="text-center py-12">
            <div className="p-4 bg-gradient-to-r from-gray-100 to-green-50 rounded-xl inline-block mb-4">
              <Home className="w-12 h-12 text-gray-400 mx-auto" />
            </div>
            <p className="text-gray-500 text-lg">No rooms added yet.</p>
            <p className="text-gray-400 text-sm mt-2">Create your first room using the form above.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {rooms.map((room, index) => (
              <div
                key={room._id}
                className="group flex items-center gap-4 border border-gray-200 p-6 rounded-xl bg-gradient-to-r from-gray-50 to-green-50 hover:from-green-50 hover:to-teal-50 transition-all duration-200 hover:shadow-lg hover:border-green-300 transform hover:scale-105"
              >
                <div className="p-3 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg shadow-lg group-hover:shadow-xl transition-all duration-200">
                  <Home className="text-white w-6 h-6" />
                </div>
                
                <div className="flex-1">
                  <p className="text-lg font-bold text-gray-800 mb-1">
                    Room {room.roomNumber}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="flex items-center space-x-1">
                      <Building2 className="w-4 h-4" />
                      <span>Type: {room.type}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Layers className="w-4 h-4" />
                      <span>Floor: {room.floorId.floorNumber}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <BedDouble className="w-4 h-4" />
                      <span>Beds: {room.totalBedOccupancy || room.numberOfBeds}</span>
                    </span>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-xs text-gray-400 mb-1">Room #{index + 1}</div>
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

export default RoomForm;