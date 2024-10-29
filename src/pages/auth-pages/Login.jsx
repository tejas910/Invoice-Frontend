import axios from 'axios';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [alert, setAlert] = useState({ message: '', type: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`http://localhost:3000/api/auth/login`, formData);
      if (res.status === 200) {
        localStorage.setItem("accesstoken", JSON.stringify(res.data.accessToken));
        localStorage.setItem("refreshtoken", JSON.stringify(res.data.refreshToken));
        setAlert({ message: 'Login successful!', type: 'success' });
        setTimeout(() => navigate("/"), 2000); // Redirect after 2 seconds
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setAlert({ message: err.response?.data.message || 'Login failed. Please try again.', type: 'error' });
      }
    }
    console.log('Form submitted:', formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h2>

        {alert.message && (
          <div className={`mb-4 p-4 rounded-md text-white ${alert.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
            {alert.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring focus:ring-blue-200"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring focus:ring-blue-200"
              minLength={8}
              placeholder="Minimum 8 characters"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white font-bold py-2 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Login
          </button>
        </form>

        <div className="mt-4 text-center">
          <span className="text-sm text-gray-600">Don't have an account? </span>
          <Link to={"/register"} className="text-blue-600 hover:underline">Register here</Link>
        </div>
      </div>
    </div>
  );
}
