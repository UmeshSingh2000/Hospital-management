import React from 'react';

const AssignModal = ({ isOpen, onClose, bed, patients, selectedPatient, onSelectPatient, onAssign }) => {
  if (!isOpen || !bed) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-md w-[90%] max-w-md space-y-4">
        <h2 className="text-xl font-bold text-blue-700">Assign Bed: {bed.bedNumber}</h2>

        <div className="text-gray-600 text-sm">
          <p><strong>Room:</strong> {bed.roomId.roomNumber}</p>
          <p><strong>Room Type:</strong> {bed.roomId.type}</p>
          <p><strong>Floor:</strong> {bed.roomId.floorId.floorNumber}</p>
        </div>

        <select
          className="w-full border p-2 rounded"
          value={selectedPatient}
          onChange={(e) => onSelectPatient(e.target.value)}
        >
          <option value="">Select Patient</option>
          {patients.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name} Age: {p.age} Phone No: {p.contactNumber}
            </option>
          ))}
        </select>

        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 text-sm rounded bg-gray-300 hover:bg-gray-400"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 text-sm rounded bg-green-600 text-white hover:bg-green-700"
            onClick={onAssign}
          >
            Confirm Assignment
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignModal;
