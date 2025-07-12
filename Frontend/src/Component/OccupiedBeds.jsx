import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { BedDouble, Building2, Home, BadgeInfo, Users, User2, RefreshCw, Eye, Trash2 } from 'lucide-react';
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

  const handleRefresh = () => {
    setLoading(true);
    fetchOccupiedBeds();
  };

  useEffect(() => {
    fetchOccupiedBeds();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading occupied beds...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-red-600 to-pink-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <BedDouble className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Occupied Beds</h2>
              <p className="text-red-100">Monitor and manage occupied patient beds</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-red-100">Total Occupied</p>
              <p className="text-2xl font-bold">{beds.length}</p>
            </div>
            <button
              onClick={handleRefresh}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
              title="Refresh beds"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <PatientDetailsModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        patient={selectedPatient}
      />

      {beds.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <BedDouble className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Occupied Beds</h3>
          <p className="text-gray-500 mb-4">All beds are currently available for patient assignment.</p>
          <button
            onClick={handleRefresh}
            className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh List
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {beds.map((bed) => (
            <div
              key={bed._id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 overflow-hidden group"
            >
              {/* Card Header */}
              <div className="bg-gradient-to-r from-red-50 to-pink-50 p-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <BedDouble className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Bed {bed.bedNumber}</h3>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                        Occupied
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-3">
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-50 rounded-lg">
                    <Home className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Room Number</p>
                    <p className="font-medium text-gray-800">{bed.roomId?.roomNumber}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <div className="flex items-center justify-center w-8 h-8 bg-yellow-50 rounded-lg">
                    <BadgeInfo className="w-4 h-4 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Room Type</p>
                    <p className="font-medium text-gray-800 capitalize">{bed.roomId?.type}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <div className="flex items-center justify-center w-8 h-8 bg-purple-50 rounded-lg">
                    <Building2 className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Floor</p>
                    <p className="font-medium text-gray-800">Floor {bed.roomId?.floorId?.floorNumber}</p>
                  </div>
                </div>

                {bed.patientId && (
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <div className="flex items-center justify-center w-8 h-8 bg-green-50 rounded-lg">
                      <User2 className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Patient</p>
                      <p className="font-medium text-gray-800">{bed.patientId.name || 'Unknown'}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className="p-4 bg-gray-50 border-t border-gray-100">
                {bed.patientId && (
                  <div className="flex gap-2">
                    <button
                      className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      onClick={() => handleShowPatient(bed.patientId)}
                    >
                      <Eye className="w-4 h-4" />
                      <span>View Patient</span>
                    </button>
                    <button
                      className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                      onClick={() => handleClearBed(bed._id)}
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Clear Bed</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats Footer */}
      {beds.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-lg mx-auto mb-3">
                <BedDouble className="w-6 h-6 text-red-600" />
              </div>
              <p className="text-2xl font-bold text-gray-800">{beds.length}</p>
              <p className="text-sm text-gray-600">Occupied Beds</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-3">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-gray-800">
                {beds.filter(bed => bed.patientId).length}
              </p>
              <p className="text-sm text-gray-600">Patients Assigned</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-3">
                <Building2 className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-gray-800">
                {new Set(beds.map(bed => bed.roomId?.floorId?.floorNumber)).size}
              </p>
              <p className="text-sm text-gray-600">Active Floors</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OccupiedBeds;