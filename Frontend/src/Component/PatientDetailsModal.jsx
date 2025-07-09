import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const PatientDetailsModal = ({ isOpen, onClose, patient }) => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && patient && !patient.doctorAssigned) {
      fetchDoctors();
    }
  }, [isOpen, patient]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

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
      toast.error('Failed to load doctors');
    }
  };

  const handleAssignDoctor = async () => {
    if (!selectedDoctor) return toast.error('Please select a doctor');
    try {
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
      toast.success(res.data.message || 'Doctor assigned successfully');
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error assigning doctor');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !patient) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md space-y-4">
        <h2 className="text-xl font-bold text-red-700">🧑‍⚕️ Patient Details</h2>

        <div className="text-sm text-gray-700 space-y-1">
          <p><strong>👤 Name:</strong> {patient.name}</p>
          <p><strong>🎂 Age:</strong> {patient.age}</p>
          <p><strong>📞 Contact:</strong> {patient.contactNumber}</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 mt-4">Assigned Doctor:</label>
          {patient.doctorAssigned && patient.doctorAssigned.name ? (
            <p className="bg-gray-100 p-2 rounded text-gray-800">
              ✅ {patient.doctorAssigned.name}
            </p>
          ) : (
            <select
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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

        <div className="flex justify-end pt-4 gap-2">
          {!patient.doctorAssigned && (
            <button
              onClick={handleAssignDoctor}
              disabled={loading}
              className={`px-4 py-2 text-sm rounded text-white ${
                loading
                  ? 'bg-green-300 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {loading ? 'Assigning...' : 'Assign Doctor'}
            </button>
          )}

          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded bg-gray-300 hover:bg-gray-400"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientDetailsModal;
