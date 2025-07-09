import React, { useEffect } from 'react';

const AssignModal = ({
  isOpen,
  onClose,
  bed,
  patients,
  selectedPatient,
  onSelectPatient,
  onAssign,
}) => {
  if (!isOpen || !bed) return null;

  // Optional: close on ESC key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm animate-fade-in"
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-white w-[90%] max-w-md rounded-xl shadow-lg p-6 space-y-5">
        <h2 className="text-xl font-bold text-blue-700">Assign Bed #{bed.bedNumber}</h2>

        <div className="text-sm text-gray-600 space-y-1">
          <p><strong>Room:</strong> {bed.roomId?.roomNumber}</p>
          <p><strong>Type:</strong> {bed.roomId?.type}</p>
          <p><strong>Floor:</strong> {bed.roomId?.floorId?.floorNumber}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Patient:</label>
          <select
            className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedPatient}
            onChange={(e) => onSelectPatient(e.target.value)}
          >
            <option value="">-- Choose Patient --</option>
            {patients.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name} — Age: {p.age}, 📞 {p.contactNumber}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-700 transition"
          >
            Cancel
          </button>
          <button
            onClick={onAssign}
            disabled={!selectedPatient}
            className={`px-4 py-2 rounded-md text-white transition
              ${selectedPatient
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-green-300 cursor-not-allowed'}
            `}
          >
            Confirm Assignment
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignModal;
