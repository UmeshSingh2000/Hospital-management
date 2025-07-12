import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { MapPin, Phone, Stethoscope, User2, Users, Plus, RefreshCw, UserPlus, X } from 'lucide-react';

const ManageAppointment = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    contactNumber: '',
    address: '',
  });
  const [showForm, setShowForm] = useState(false);

  const fetchPatients = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/getAllPatients`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setPatients(res.data || []);
    } catch (error) {
      console.error('Failed to fetch patients:', error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, age, gender, contactNumber, address } = formData;
    if (!name || !age || !gender || !contactNumber || !address) {
      toast.error('Please fill all required fields');
      return;
    }
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/user/createNewPatient`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      if (res.status === 201) {
        toast.success('Patient added successfully!');
        setFormData({ name: '', age: '', gender: '', contactNumber: '', address: '' });
        setShowForm(false);
        fetchPatients();
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to add patient');
    }
  };

  const handleRefresh = () => {
    setLoading(true);
    fetchPatients();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading patients...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Users className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Manage Appointments</h2>
              <p className="text-blue-100">Add new patients and manage existing ones</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-blue-100">Total Patients</p>
              <p className="text-2xl font-bold">{patients.length}</p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
              title="Add new patient"
            >
              {showForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            </button>
            <button
              onClick={handleRefresh}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
              title="Refresh patients"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Add Patient Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-green-100 rounded-lg">
              <UserPlus className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Add New Patient</h3>
              <p className="text-gray-600">Fill in the patient information below</p>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Patient Name"
              className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder="Age"
              className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <input
              type="text"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              placeholder="Contact Number"
              className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Address"
              className="w-full col-span-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="3"
            />
            <button
              type="submit"
              className="col-span-full flex items-center justify-center space-x-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium"
            >
              <UserPlus className="w-4 h-4" />
              <span>Create Patient</span>
            </button>
          </form>
        </div>
      )}

      {/* Patients List */}
      {patients.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Users className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Patients Found</h3>
          <p className="text-gray-500 mb-4">Start by adding your first patient to the system.</p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Patient
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {patients.map((patient) => (
            <div
              key={patient._id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 overflow-hidden group"
            >
              {/* Card Header */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <User2 className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{patient.name}</h3>
                    <p className="text-sm text-gray-600">{patient.gender}, {patient.age} years</p>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-3">
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <div className="flex items-center justify-center w-8 h-8 bg-green-50 rounded-lg">
                    <Phone className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Contact</p>
                    <p className="font-medium text-gray-800">{patient.contactNumber}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <div className="flex items-center justify-center w-8 h-8 bg-purple-50 rounded-lg">
                    <MapPin className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Address</p>
                    <p className="font-medium text-gray-800">{patient.address || 'No address'}</p>
                  </div>
                </div>

                {patient.doctorAssigned && (
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <div className="flex items-center justify-center w-8 h-8 bg-red-50 rounded-lg">
                      <Stethoscope className="w-4 h-4 text-red-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Assigned Doctor</p>
                      <p className="font-medium text-gray-800">{patient.doctorAssigned.name || 'Unknown'}</p>
                    </div>
                  </div>
                )}

                {Array.isArray(patient.medicalHistory) && patient.medicalHistory.length > 0 && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-2">Medical History</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {patient.medicalHistory.map((item, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats Footer */}
      {patients.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-3">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-gray-800">{patients.length}</p>
              <p className="text-sm text-gray-600">Total Patients</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-3">
                <Stethoscope className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-gray-800">
                {patients.filter(p => p.doctorAssigned).length}
              </p>
              <p className="text-sm text-gray-600">Assigned to Doctors</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-3">
                <UserPlus className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-gray-800">
                {patients.filter(p => !p.doctorAssigned).length}
              </p>
              <p className="text-sm text-gray-600">Awaiting Assignment</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageAppointment;