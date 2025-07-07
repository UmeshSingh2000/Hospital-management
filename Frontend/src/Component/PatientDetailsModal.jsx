import React from 'react';

const PatientDetailsModal = ({ isOpen, onClose, patient }) => {
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

        <div className="flex justify-end mt-6">
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
