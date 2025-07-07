import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BedDouble, Building2, Home, BadgeInfo } from 'lucide-react';
import AssignModal from './AssignModal'; // import the modal
import toast from 'react-hot-toast';

const AvailableBeds = () => {
  const [beds, setBeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [patients, setPatients] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBed, setSelectedBed] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState('');

  const fetchAvailableBeds = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/getAvailableBeds`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setBeds(res.data || []);
    } catch (error) {
      console.error('Failed to fetch beds:', error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchPatients = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/getUnOccupiedPatients`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setPatients(res.data || []);
    } catch (error) {
      console.error('Failed to fetch patients:', error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async () => {
    if (!selectedPatient || !selectedBed) return alert("Select patient and bed.");

    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/assignedBedToPatient`, {
        bedId: selectedBed._id,
        patientId: selectedPatient
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      toast.success('Bed assigned successfully!');
      setModalOpen(false);
      setSelectedPatient('');
      setSelectedBed(null);
      fetchAvailableBeds(); // refresh list
    } catch (error) {
      console.log(error)
      toast.error('Assign failed:', error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    fetchAvailableBeds();
    fetchPatients();
  }, []);

  if (loading) return <p className="text-center text-gray-500 mt-10">Loading available beds...</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold text-blue-800 mb-6">🛏️ Available Beds</h2>

      <AssignModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        bed={selectedBed}
        patients={patients}
        selectedPatient={selectedPatient}
        onSelectPatient={setSelectedPatient}
        onAssign={handleAssign}
      />

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

              <button
                className="mt-2 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                onClick={() => {
                  setSelectedBed(bed);
                  setModalOpen(true);
                }}
              >
                Assign Bed
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AvailableBeds;
