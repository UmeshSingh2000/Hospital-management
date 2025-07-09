import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { User2, Mail, ShieldCheck, Users } from 'lucide-react';
import { Loader2 } from 'lucide-react';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/admin/getAllUsers`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setUsers(res.data.users);
    } catch (error) {
      console.error('Error fetching users:', error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg p-8 shadow-xl rounded-2xl border border-white/20">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg">
            <Users className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-800">All Users</h3>
          <div className="ml-auto">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
              {users.length} User{users.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-3 text-gray-600">Loading users...</span>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12">
            <div className="p-4 bg-gradient-to-r from-gray-100 to-blue-50 rounded-xl inline-block mb-4">
              <User2 className="w-12 h-12 text-gray-400 mx-auto" />
            </div>
            <p className="text-gray-500 text-lg">No users found.</p>
            <p className="text-gray-400 text-sm mt-2">Add users to view them here.</p>
          </div>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {users.map((user, index) => (
              <li
                key={user._id}
                className="group flex items-start gap-4 border border-gray-200 p-6 rounded-xl bg-gradient-to-r from-gray-50 to-blue-50 hover:from-blue-50 hover:to-purple-50 transition-all duration-200 hover:shadow-lg hover:border-blue-300 transform hover:scale-105"
              >
                <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg group-hover:shadow-xl transition-all duration-200">
                  <User2 className="text-white w-6 h-6" />
                </div>

                <div className="flex-1 space-y-1">
                  <p className="text-lg font-bold text-gray-800">
                    {user.role === 'doctor' ? 'Dr. ' : ''}
                    {user.name}
                  </p>
                  <p className="text-sm text-gray-700 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-green-500" />
                    {user.email}
                  </p>
                  <p className="text-sm text-gray-700 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-purple-500" />
                    Role: {user.role}
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-xs text-gray-400 mb-1">#{index + 1}</div>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default UsersList;
