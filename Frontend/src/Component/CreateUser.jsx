import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { UserPlus } from 'lucide-react';

const CreateUser = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/admin/registerUser`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      if (res.status === 201) {
        toast.success(res.data.message);
        setFormData({ name: '', email: '', password: '', role: '' });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to register user');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-10">
      <div className="bg-white/80 backdrop-blur-lg p-8 shadow-xl rounded-2xl border border-white/20">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg">
            <UserPlus className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-800">Create New User</h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter full name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/50 hover:bg-white/70 transition"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/50 hover:bg-white/70 transition"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/50 hover:bg-white/70 transition"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Select Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/50 hover:bg-white/70 transition"
            >
              <option value="">Select Role</option>
              <option value="doctor">Doctor</option>
              <option value="nurse">Nurse</option>
              <option value="receptionist">Receptionist</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Create User
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateUser;
