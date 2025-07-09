import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { MapPin, Phone, Stethoscope, User2 } from 'lucide-react';

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

  return (
    <div className="max-w-6xl mx-auto">
      {/* Top Navbar */}
      <div className="bg-white px-6 py-4 flex justify-between items-center border-b">
        <h2 className="text-xl sm:text-2xl font-bold text-blue-800">📋 Manage Appointments</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
        >
          {showForm ? 'Cancel' : '➕ Add New Patient'}
        </button>
      </div>

      {/* Add Patient Form */}
      {showForm && (
        <div className="bg-white mt-6 p-6 rounded-lg shadow-md border">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Patient Name"
              className="w-full border px-4 py-2 rounded-md"
            />
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder="Age"
              className="w-full border px-4 py-2 rounded-md"
            />
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-md"
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
              className="w-full border px-4 py-2 rounded-md"
            />
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Address"
              className="w-full col-span-full border px-4 py-2 rounded-md"
            />
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-medium col-span-full"
            >
              Create Patient
            </button>
          </form>
        </div>
      )}

      {/* All Patients */}
      <div className="mt-10 px-4">
        <h2 className="text-2xl font-bold text-blue-800 mb-6">🧑‍⚕️ All Patients</h2>
        {loading ? (
          <p className="text-gray-500">Loading patients...</p>
        ) : patients.length === 0 ? (
          <p className="text-gray-500">No patients found.</p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {patients.map((patient) => (
              <li
                key={patient._id}
                className="border p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition space-y-2"
              >
                <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                  <User2 className="w-5 h-5 text-blue-600" />
                  {patient.name} ({patient.gender}, {patient.age} yrs)
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4 text-green-500" />
                  {patient.contactNumber}
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 text-purple-500" />
                  {patient.address || 'No address'}
                </div>

                {Array.isArray(patient.medicalHistory) && patient.medicalHistory.length > 0 && (
                  <div className="text-sm text-gray-600">
                    <ul className="list-disc pl-5">
                      {patient.medicalHistory.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {patient.doctorAssigned && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Stethoscope className="w-4 h-4 text-red-500" />
                    Assigned to Doctor: {patient.doctorAssigned.name || 'Unknown'}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ManageAppointment;
