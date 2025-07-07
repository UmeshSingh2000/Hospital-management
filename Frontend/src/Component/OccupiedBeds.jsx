import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BedDouble, Building2, Home, BadgeInfo } from 'lucide-react';
import PatientDetailsModal from './PatientDetailsModal'; // 👈 import modal

const OccupiedBeds = () => {
  const [beds, setBeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const fetchOccupiedBeds = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/getOccupiedBeds`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setBeds(res.data || []);
    } catch (error) {
      console.error('Failed to fetch occupied beds:', error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleShowPatient = (patient) => {
    setSelectedPatient(patient);
    setModalOpen(true);
  };

  useEffect(() => {
    fetchOccupiedBeds();
  }, []);

  if (loading) return <p className="text-gray-500 text-center mt-10">Loading occupied beds...</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold text-red-700 mb-6">🚫 Occupied Beds</h2>

      <PatientDetailsModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        patient={selectedPatient}
      />

      {beds.length === 0 ? (
        <p className="text-gray-500">No occupied beds found.</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {beds.map((bed) => (
            <li
              key={bed._id}
              className="border p-4 rounded-lg bg-red-50 hover:bg-red-100 transition space-y-2"
            >
              <div className="flex items-center gap-2 text-lg font-semibold text-red-700">
                <BedDouble className="w-5 h-5 text-red-600" />
                Bed No: {bed.bedNumber}
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Home className="w-4 h-4 text-blue-500" />
                Room: {bed.roomId.roomNumber}
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-700">
                <BadgeInfo className="w-4 h-4 text-yellow-500" />
                Room Type: {bed.roomId.type}
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Building2 className="w-4 h-4 text-purple-500" />
                Floor: {bed.roomId.floorId.floorNumber}
              </div>

              {bed.patientId && (
                <button
                  className="mt-2 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                  onClick={() => handleShowPatient(bed.patientId)}
                >
                  Show Patient
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OccupiedBeds;
