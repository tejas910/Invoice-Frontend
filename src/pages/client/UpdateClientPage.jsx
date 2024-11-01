import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const UpdateClientPage = () => {
  const { id } = useParams();
  const accesstoken = JSON.parse(localStorage.getItem("accesstoken"));
  
  const navigate = useNavigate();
  const [client, setClient] = useState({
    email: '',
    phoneNo: '',

  });

  const fetchClientDetails = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/customers/${id}`, {
        headers: { Authorization: `Bearer ${accesstoken}` },
      });
      if(res.status==200){
        console.log(res.data.result)
      }
      setClient(res.data.result);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.log(err.response?.data.message);
      }
    }
  };

  useEffect(() => {
    fetchClientDetails();
  }, [id]);

  const handleClientChange = (e) => {
    const { name, value } = e.target;
    setClient((prev) => ({ ...prev, [name]: value }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`http://localhost:3000/api/customers/${id}`, client, {
        headers: { Authorization: `Bearer ${accesstoken}` },
      });
      if (res.status === 200) {
        navigate("/client");
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.log(err.response?.data.message);
      }
    }
  };

  return (
    <div className="container mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Update Client</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="email">Email*</label>
            <input
              id="email"
              name="email"
              type="text"
              value={client.email}
              onChange={handleClientChange}
              placeholder="Enter email"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring focus:ring-indigo-500"
              required
            />
          </div>
          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="phone-no">Phone Number*</label>
            <input
              id="phone-no"
              name="phoneNo"
              type="text"
              value={client.phoneNo}
              onChange={handleClientChange}
              placeholder="Enter phone number"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring focus:ring-indigo-500"
              required
            />
          </div>
    </div>
        <div className="flex justify-end space-x-3">
          <button type="button" className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md" onClick={() => navigate("/client")}>
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 text-white bg-indigo-600 rounded-md">
            Update Client
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateClientPage;
