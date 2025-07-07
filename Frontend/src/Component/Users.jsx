import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { User2, Mail, ShieldCheck } from 'lucide-react';

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

  if (loading) return <p className="text-center mt-10 text-gray-600">Loading users...</p>;

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-10">
      <div className="bg-white p-6 shadow-md border rounded-lg">
        <h3 className="text-2xl font-bold text-blue-800 mb-6">👥 All Users</h3>
        {users.length === 0 ? (
          <p className="text-gray-500">No users found.</p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {users.map((user) => (
              <li
                key={user._id}
                className="border p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition flex flex-col gap-2"
              >
                <div className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <User2 className="w-5 h-5 text-blue-500" />
                  {user.role === 'doctor' ? 'Dr. ' : ''}
                  {user.name}
                </div>
                <div className="text-sm text-gray-700 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-green-500" />
                  {user.email}
                </div>
                <div className="text-sm text-gray-700 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-purple-500" />
                  Role: {user.role}
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
