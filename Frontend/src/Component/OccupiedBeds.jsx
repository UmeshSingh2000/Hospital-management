import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { BedDouble, Building2, Home, BadgeInfo } from 'lucide-react';
import PatientDetailsModal from './PatientDetailsModal';

const OccupiedBeds = () => {
  const [beds, setBeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const fetchOccupiedBeds = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/getOccupiedBeds`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setBeds(res.data || []);
    } catch (error) {
      console.error('Failed to fetch occupied beds:', error.response?.data?.message || error.message);
      toast.error('Error fetching occupied beds');
    } finally {
      setLoading(false);
    }
  };

  const handleShowPatient = (patient) => {
    setSelectedPatient(patient);
    setModalOpen(true);
  };

  const handleClearBed = async (bedId) => {
    const confirmClear = window.confirm('Are you sure you want to clear this bed?');
    if (!confirmClear) return;

    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/clearBed/${bedId}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      toast.success('Bed cleared successfully');
      fetchOccupiedBeds(); // refresh list
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to clear bed');
    }
  };

  useEffect(() => {
    fetchOccupiedBeds();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-red-700 mb-6">🚫 Occupied Beds</h2>

      <PatientDetailsModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        patient={selectedPatient}
      />

      {loading ? (
        <p className="text-center text-gray-500 mt-10 animate-pulse">Loading occupied beds...</p>
      ) : beds.length === 0 ? (
        <p className="text-gray-500">No occupied beds found.</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {beds.map((bed) => (
            <li
              key={bed._id}
              className="border p-4 rounded-lg bg-red-50 hover:bg-red-100 transition shadow-sm space-y-2"
            >
              <div className="flex items-center gap-2 text-lg font-semibold text-red-700">
                <BedDouble className="w-5 h-5 text-red-600" />
                Bed No: {bed.bedNumber}
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Home className="w-4 h-4 text-blue-500" />
                Room: {bed.roomId?.roomNumber}
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-700">
                <BadgeInfo className="w-4 h-4 text-yellow-500" />
                Room Type: {bed.roomId?.type}
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Building2 className="w-4 h-4 text-purple-500" />
                Floor: {bed.roomId?.floorId?.floorNumber}
              </div>

              {bed.patientId && (
                <div className="flex gap-2 pt-3">
                  <button
                    className="flex-1 px-3 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition"
                    onClick={() => handleShowPatient(bed.patientId)}
                  >
                    Show Patient
                  </button>
                  <button
                    className="flex-1 px-3 py-2 bg-gray-700 text-white text-sm rounded-md hover:bg-gray-800 transition"
                    onClick={() => handleClearBed(bed._id)}
                  >
                    Clear Bed
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OccupiedBeds;
