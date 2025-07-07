import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');

        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/admin/login`, {
                email,
                password
            });
            if (response.status === 200) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('role', response.data.role);
            }

            // redirect based on role
            if (response.data.role === 'admin') {
                navigate('/admin/dashboard');
            } else if(response.data.role === 'receptionist') {
                navigate('/receptionist/dashboard');
            }
        } catch (error) {
            setErrorMsg(error.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <form onSubmit={handleLogin} className="bg-white shadow-md rounded p-8 w-full max-w-sm">
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

                {errorMsg && (
                    <div className="bg-red-100 text-red-700 p-2 mb-4 rounded text-sm">
                        {errorMsg}
                    </div>
                )}

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm mb-2">Email</label>
                    <input
                        type="email"
                        required
                        className="w-full p-2 border border-gray-300 rounded"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 text-sm mb-2">Password</label>
                    <input
                        type="password"
                        required
                        className="w-full p-2 border border-gray-300 rounded"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    );
};

export default Login;
