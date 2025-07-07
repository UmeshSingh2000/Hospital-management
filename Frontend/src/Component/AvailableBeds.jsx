import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BedDouble, Building2, Home, BadgeInfo } from 'lucide-react';

const AvailableBeds = () => {
  const [beds, setBeds] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAvailableBeds = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/getAvailableBeds`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setBeds(res.data || []);
    } catch (error) {
      console.error('Failed to fetch beds:', error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailableBeds();
  }, []);

  if (loading) return <p className="text-gray-500 text-center mt-10">Loading available beds...</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold text-blue-800 mb-6">🛏️ Available Beds</h2>
      {beds.length === 0 ? (
        <p className="text-gray-500">No available beds found.</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {beds.map((bed) => (
            <li
              key={bed._id}
              className="border p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition space-y-2"
            >
              <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                <BedDouble className="w-5 h-5 text-green-600" />
                Bed No: {bed.bedNumber}
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Home className="w-4 h-4 text-blue-500" />
                Room: {bed.roomId.roomNumber}
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <BadgeInfo className="w-4 h-4 text-yellow-500" />
                Room Type: {bed.roomId.type}
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Building2 className="w-4 h-4 text-purple-500" />
                Floor: {bed.roomId.floorId.floorNumber}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AvailableBeds;
