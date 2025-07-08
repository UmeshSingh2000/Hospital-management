import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const PatientDetailsModal = ({ isOpen, onClose, patient }) => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && !patient.doctorAssigned) {
      fetchDoctors();
    }
  }, [isOpen]);

  const fetchDoctors = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/getDoctors`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setDoctors(res.data.doctors);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const handleAssignDoctor = async () => {
    try {
      if (!selectedDoctor) return toast.error('Please select a doctor');
      setLoading(true);

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/user/assigDoctorToPatient/${patient._id}`,
        { doctorId: selectedDoctor },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      toast.success(res.data.message);
      onClose(); // Close modal after assignment
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error assigning doctor');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !patient) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
        <h2 className="text-xl font-bold text-red-700 mb-4">Patient Details</h2>

        <div className="space-y-2 text-sm text-gray-700">
          <p><strong>👤 Name:</strong> {patient.name}</p>
          <p><strong>🎂 Age:</strong> {patient.age}</p>
          <p><strong>📞 Contact:</strong> {patient.contactNumber}</p>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium mb-1">Assigned Doctor:</label>
          {patient.doctorAssigned && patient.doctorAssigned.name ? (
            <p className="p-2 border rounded bg-gray-100 text-gray-800">
              ✅ {patient.doctorAssigned.name}
            </p>
          ) : (
            <select
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">-- Select a Doctor --</option>
              {doctors.map((doc) => (
                <option key={doc._id} value={doc._id}>
                  {doc.name}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="flex justify-end mt-6 gap-2">
          {!patient.doctorAssigned ? (
            <button
              onClick={handleAssignDoctor}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
              disabled={loading}
            >
              {loading ? 'Assigning...' : 'Assign Doctor'}
            </button>
          ) : null}

          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientDetailsModal;
