import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Loader2,
  BedDouble,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

const FloorDetails = () => {
  const { floorId } = useParams();
  const [searchParams] = useSearchParams();
  const floorNumber = searchParams.get('floorNumber');

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedRoomId, setExpandedRoomId] = useState(null);
  const [bedsByRoom, setBedsByRoom] = useState({});
  const [loadingBedsFor, setLoadingBedsFor] = useState(null);

  const navigate = useNavigate();

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/user/getAllRoomsByFloor/${floorId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      const data = await res.json();
      setRooms(data.rooms || []);
    } catch (error) {
      console.error('Error fetching rooms:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchBeds = async (roomId) => {
    setLoadingBedsFor(roomId);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/user/getBedByRoom/${roomId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      const data = await res.json();
      setBedsByRoom((prev) => ({ ...prev, [roomId]: data }));
    } catch (err) {
      console.error('Error fetching beds:', err.message);
      setBedsByRoom((prev) => ({ ...prev, [roomId]: [] }));
    } finally {
      setLoadingBedsFor(null);
    }
  };

  const handleRoomClick = (roomId) => {
    if (expandedRoomId === roomId) {
      setExpandedRoomId(null); // collapse
    } else {
      setExpandedRoomId(roomId);
      if (!bedsByRoom[roomId]) {
        fetchBeds(roomId);
      }
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [floorId]);

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 space-y-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-blue-600 hover:underline"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Floors
      </button>

      <h1 className="text-3xl font-bold text-gray-800 text-center">
        Rooms on Floor {floorNumber || ''}
      </h1>

      {loading ? (
        <div className="flex justify-center items-center">
          <Loader2 className="animate-spin w-6 h-6 text-blue-500" />
          <span className="ml-2 text-gray-600">Loading rooms...</span>
        </div>
      ) : rooms.length === 0 ? (
        <p className="text-center text-gray-500">No rooms found on this floor.</p>
      ) : (
        <div className="grid gap-4">
          {rooms.map((room) => (
            <div
              key={room._id}
              className="border border-gray-300 rounded-xl shadow-md bg-white"
            >
              <div
                onClick={() => handleRoomClick(room._id)}
                className="p-4 flex items-center gap-4 cursor-pointer hover:bg-blue-50 transition"
              >
                <div className="p-3 bg-blue-100 rounded-lg">
                  <BedDouble className="text-blue-600 w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Room #{room.roomNumber}
                  </h2>
                  <p className="text-sm text-gray-600">
                    Type: {room.type || 'Standard'}
                  </p>
                </div>
                {expandedRoomId === room._id ? (
                  <ChevronUp className="text-gray-500 w-5 h-5" />
                ) : (
                  <ChevronDown className="text-gray-500 w-5 h-5" />
                )}
              </div>

              {/* Beds Section */}
              {expandedRoomId === room._id && (
                <div className="px-6 pb-4">
                  {loadingBedsFor === room._id ? (
                    <div className="flex items-center text-gray-500 py-2">
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Loading beds...
                    </div>
                  ) : bedsByRoom[room._id]?.length > 0 ? (
                    <ul className="space-y-2 mt-2">
                      {bedsByRoom[room._id].map((bed) => (
                        <li
                          key={bed._id}
                          className="p-4 bg-gray-100 rounded-lg text-sm text-gray-800"
                        >
                          <div className="font-semibold mb-1">
                            🛏 Bed #{bed.bedNumber}{' '}
                            {bed.isOccupied ? '🟥 Occupied' : '🟩 Available'}
                          </div>

                          {bed.patientId && (
                            <div className="text-gray-700 mb-2">
                              Currently assigned to:{' '}
                              <span className="font-medium text-gray-900">
                                {bed.patientId.name} ({bed.patientId.gender}, Age: {bed.patientId.age})
                              </span>
                            </div>
                          )}

                          {bed.occupancyHistory?.length > 0 ? (
                            <div className="text-gray-700">
                              <div className="font-medium mb-1 text-gray-600">
                                Occupancy History:
                              </div>
                              <ul className="pl-4 space-y-1 list-disc">
                                {bed.occupancyHistory.map((entry) => (
                                  <li key={entry._id}>
                                    <div>
                                      👤 Patient:{' '}
                                      <span className="text-gray-900">
                                        {entry.patient?.name || 'Unknown'} ({entry.patient?.gender || 'N/A'}, Age: {entry.patient?.age || 'N/A'})
                                      </span>
                                    </div>
                                    <div>
                                      ⏱️ From:{' '}
                                      <span className="text-gray-600">
                                        {new Date(entry.from).toLocaleString()}
                                      </span>
                                    </div>
                                    <div>
                                      ⏱️ To:{' '}
                                      <span className="text-gray-600">
                                        {new Date(entry.to).toLocaleString()}
                                      </span>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ) : (
                            <div className="text-gray-500 mt-1">
                              No occupancy history available.
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-gray-500 mt-2">
                      No beds found for this room.
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FloorDetails;
