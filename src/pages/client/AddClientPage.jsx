import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddClientPage = () => {
  const accesstoken = JSON.parse(localStorage.getItem("accesstoken"))
  
  const navigate = useNavigate();
  const [client, setClient] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNo: '',
    panNo: '',
    companyName: '',
    clientGstinNumber: '',
    addresses: [],
  });

  console.log(client)
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    country: '',
    postCode: '',
  });

  const handleClientChange = (e) => {
    const { name, value } = e.target;
    setClient((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const addAddress = () => {
    setClient((prev) => ({
      ...prev,
      addresses: [...prev.addresses, address],
    }));
    setAddress({
      street: '',
      city: '',
      state: '',
      country: '',
      postCode: '',
    });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log('Submitting client:', client);
    try{  
      const res = await axios.post(`http://localhost:3000/api/customers`,client, {headers:{Authorization:`Bearer ${accesstoken}`}})
      if(res.status==201){
        navigate("/client")
      }
    }catch(err){
      if(axios.isAxiosError(err)){
        console.log(err.response?.data.message)
      }
    }
  };

  return (
    <div className="container mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Add Client</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="first-name">First Name*</label>
            <input
              id="first-name"
              name="firstName"
              type="text"
              value={client.firstName}
              onChange={handleClientChange}
              placeholder="Enter first name"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring focus:ring-indigo-500"
              required
            />
          </div>
          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="last-name">Last Name*</label>
            <input
              id="last-name"
              name="lastName"
              type="text"
              value={client.lastName}
              onChange={handleClientChange}
              placeholder="Enter last name"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring focus:ring-indigo-500"
              required
            />
          </div>
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
          {/* PAN Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="pan-no">PAN Number</label>
            <input
              id="pan-no"
              name="panNo"
              type="text"
              value={client.panNo}
              onChange={handleClientChange}
              placeholder="Enter PAN number"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring focus:ring-indigo-500"
            />
          </div>
          {/* Company Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="company-name">Company Name</label>
            <input
              id="company-name"
              name="companyName"
              type="text"
              value={client.companyName}
              onChange={handleClientChange}
              placeholder="Enter company name"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring focus:ring-indigo-500"
            />
          </div>
          {/* GSTIN Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="gstin-number">GSTIN Number</label>
            <input
              id="gstin-number"
              name="clientGstinNumber"
              type="text"
              value={client.clientGstinNumber}
              onChange={handleClientChange}
              placeholder="Enter GSTIN number"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Address Section */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Addresses</h2>
          {client.addresses.map((addr, index) => (
            <div key={index} className="border p-4 rounded-md mb-4">
              <h3 className="font-medium">Address {index + 1}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700" htmlFor={`street-${index}`}>Street*</label>
                  <input
                    id={`street-${index}`}
                    name="street"
                    type="text"
                    value={addr.street}
                    onChange={(e) => {
                      const updatedAddresses = [...client.addresses];
                      updatedAddresses[index].street = e.target.value;
                      setClient({ ...client, addresses: updatedAddresses });
                    }}
                    placeholder="Enter street"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700" htmlFor={`city-${index}`}>City*</label>
                  <input
                    id={`city-${index}`}
                    name="city"
                    type="text"
                    value={addr.city}
                    onChange={(e) => {
                      const updatedAddresses = [...client.addresses];
                      updatedAddresses[index].city = e.target.value;
                      setClient({ ...client, addresses: updatedAddresses });
                    }}
                    placeholder="Enter city"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700" htmlFor={`state-${index}`}>State*</label>
                  <input
                    id={`state-${index}`}
                    name="state"
                    type="text"
                    value={addr.state}
                    onChange={(e) => {
                      const updatedAddresses = [...client.addresses];
                      updatedAddresses[index].state = e.target.value;
                      setClient({ ...client, addresses: updatedAddresses });
                    }}
                    placeholder="Enter state"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700" htmlFor={`country-${index}`}>Country*</label>
                  <input
                    id={`country-${index}`}
                    name="country"
                    type="text"
                    value={addr.country}
                    onChange={(e) => {
                      const updatedAddresses = [...client.addresses];
                      updatedAddresses[index].country = e.target.value;
                      setClient({ ...client, addresses: updatedAddresses });
                    }}
                    placeholder="Enter country"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700" htmlFor={`postCode-${index}`}>Post Code*</label>
                  <input
                    id={`postCode-${index}`}
                    name="postCode"
                    type="text"
                    value={addr.postCode}
                    onChange={(e) => {
                      const updatedAddresses = [...client.addresses];
                      updatedAddresses[index].postCode = e.target.value;
                      setClient({ ...client, addresses: updatedAddresses });
                    }}
                    placeholder="Enter post code"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addAddress}
            className="mt-4 px-4 py-2 text-white bg-indigo-600 rounded-md"
          >
            Add Address
          </button>
        </div>

        <div className="flex justify-end space-x-3">
          <button type="button" className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md">
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 text-white bg-indigo-600 rounded-md">
            Add Client
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddClientPage;
