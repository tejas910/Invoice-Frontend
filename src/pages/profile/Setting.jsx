import React, { useState } from 'react';
import { ChevronDown, Trophy, Upload } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Setting() {
  const accesstoken = JSON.parse(localStorage.getItem("accesstoken"))
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    companyName: '',
    companyPhone: '',
    street: '',
    city: '',
    state: '',
    country: '',
    postCode: '',
    bankName: '',
    bankAccountNumber: '',
    bankBranchName: '',
    ifscCode: '',
    gstinNumber: '',
    panNumber: '',
    msmeNumber: '',
    userName: '',
    email: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmitCompany = (e) => {
    e.preventDefault();
    console.log('Company Settings saved:', settings);
  };

  const fetchUserDetails = async()=>{
    try{
      const res = await axios.get(`http://localhost:3000/api/users`,
        {
          headers:{
            Authorization:`Bearer ${accesstoken}`
          }
        }
      )
      if(res.status==200){
        console.log(res.data.user)
      }
    }catch(err){
      if(axios.isAxiosError(err)){
        console.log(err.response?.data.message)
      }
    }
  }

  const handleSubmitBank = async(e) => {
    e.preventDefault();
    console.log('Bank Settings saved:', settings);
    try{  
      const res = await axios.put(`http://localhost:3000/api/users/`,{
        bankName: settings.bankName,
        bankAccountNumber: settings.bankAccountNumber,
        bankBranchName: settings.bankBranchName,
        ifscCode: settings.ifscCode,
      },{
        headers:{
          Authorization:`Bearer ${accesstoken}`
        }
      })
      if(res.status==200){
        navigate("/profile")
      }
    }catch(err){
      if(axios.isAxiosError(err)){
        console.log(err.response?.data.message)
      }
    }
  };

  const handleSubmitPersonal = async(e) => {
    e.preventDefault();
    console.log('Personal Settings saved:', settings);
    try{  
      const res = await axios.put(`http://localhost:3000/api/users/`,{
        street: settings.street,
        city: settings.city,
        state: settings.state,
        country: settings.country,
        postCode: settings.postCode,
        gstinNumber: settings.gstinNumber,
        panNumber: settings.panNumber,
        msmeNumber: settings.msmeNumber,
        userName: settings.userName,
        email: settings.email
      },{
        headers:{
          Authorization:`Bearer ${accesstoken}`
        }
      })
      if(res.status==200){
        navigate("/profile")
      }
    }catch(err){
      if(axios.isAxiosError(err)){
        console.log(err.response?.data.message)
      }
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 bg-gray-50">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      {/* Company Information Section */}
      <form onSubmit={handleSubmitCompany} className="space-y-6">
        <h2 className="text-xl font-semibold mb-4">Company Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div>
            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">Company Name*</label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={settings.companyName}
              onChange={handleChange}
              className="border mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-4 py-2"
              required
            />
          </div>
          <div>
            <label htmlFor="companyPhone" className="block text-sm font-medium text-gray-700">Company Phone*</label>
            <input
              type="tel"
              id="companyPhone"
              name="companyPhone"
              value={settings.companyPhone}
              onChange={handleChange}
              className="border mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-4 py-2"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Company Logo*</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label htmlFor="logo-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                    <span>Upload a file</span>
                    <input id="logo-upload" name="companyLogo" type="file" className="sr-only" onChange={handleChange} />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Signature*</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label htmlFor="signature-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                    <span>Upload a file</span>
                    <input id="signature-upload" name="companyAuthorizedSign" type="file" className="sr-only" onChange={handleChange} />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Stamp*</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label htmlFor="stamp-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                    <span>Upload a file</span>
                    <input id="stamp-upload" name="companyStamp" type="file" className="sr-only" onChange={handleChange} />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Save Company Info
          </button>
        </div>
      </form>

      {/* Bank Details Section */}
      <form onSubmit={handleSubmitBank} className="space-y-6 mt-8">
        <h2 className="text-xl font-semibold mb-4">Bank Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div>
            <label htmlFor="bankName" className="block text-sm font-medium text-gray-700">Bank Name*</label>
            <input
              type="text"
              id="bankName"
              name="bankName"
              value={settings.bankName}
              onChange={handleChange}
              className="border mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-4 py-2"
              required
            />
          </div>
          <div>
            <label htmlFor="bankAccountNumber" className="block text-sm font-medium text-gray-700">Account Number*</label>
            <input
              type="text"
              id="bankAccountNumber"
              name="bankAccountNumber"
              value={settings.bankAccountNumber}
              onChange={handleChange}
              className="border mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-4 py-2"
              required
            />
          </div>
          <div>
            <label htmlFor="ifscCode" className="block text-sm font-medium text-gray-700">IFSC Code*</label>
            <input
              type="text"
              id="ifscCode"
              name="ifscCode"
              value={settings.ifscCode}
              onChange={handleChange}
              className="border mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-4 py-2"
              required
            />
          </div>
          <div>
            <label htmlFor="bankBranchName" className="block text-sm font-medium text-gray-700">Branch Name*</label>
            <input
              type="text"
              id="bankBranchName"
              name="bankBranchName"
              value={settings.bankBranchName}
              onChange={handleChange}
              className="border mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-4 py-2"
              required
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Save Bank Details
          </button>
        </div>
      </form>

      {/* Personal Information Section */}
      <form onSubmit={handleSubmitPersonal} className="space-y-6 mt-8">
        <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
         
          <div>
            <label htmlFor="userName" className="block text-sm font-medium text-gray-700">Username*</label>
            <input
              type="text"
              id="userName"
              name="userName"
              value={settings.userName}
              onChange={handleChange}
              className="border mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-4 py-2"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Pan No*</label>
            <input
              type="text"
              id="panNumber"
              name="panNumber"
              value={settings.panNumber}
              onChange={handleChange}
              className="border mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-4 py-2"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email*</label>
            <input
              type="email"
              id="email"
              name="email"
              value={settings.email}
              onChange={handleChange}
              className="border mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-4 py-2"
              required
            />
          </div>
          <div>
            <label htmlFor="gstinNumber" className="block text-sm font-medium text-gray-700">GST No.*</label>
            <input
              type="number"
              id="gstno"
              name="gstinNumber"
              value={settings.gstinNumber}
              onChange={handleChange}
              className="border mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-4 py-2"
              required
            />
          </div>
          <div>
            <label htmlFor="msmeNo" className="block text-sm font-medium text-gray-700">MSME No.*</label>
            <input
              type="number"
              id="msmeNo"
              name="msmeNumber"
              value={settings.msmeNumber}
              onChange={handleChange}
              className="border mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-4 py-2"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div>
            <label htmlFor="street" className="block text-sm font-medium text-gray-700">Street*</label>
            <input
              type="text"
              id="street"
              name="street"
              value={settings.street}
              onChange={handleChange}
              className="border mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-4 py-2"
              required
            />
          </div>
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700">City*</label>
            <input
              type="text"
              id="city"
              name="city"
              value={settings.city}
              onChange={handleChange}
              className="border mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-4 py-2"
              required
            />
          </div>
          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700">State*</label>
            <input
              type="text"
              id="state"
              name="state"
              value={settings.state}
              onChange={handleChange}
              className="border mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-4 py-2"
              required
            />
          </div>
          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country*</label>
            <input
              type="text"
              id="country"
              name="country"
              value={settings.country}
              onChange={handleChange}
              className="border mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-4 py-2"
              required
            />
          </div>
          <div>
            <label htmlFor="postCode" className="block text-sm font-medium text-gray-700">Post Code*</label>
            <input
              type="text"
              id="postCode"
              name="postCode"
              value={settings.postCode}
              onChange={handleChange}
              className="border mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-4 py-2"
              required
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Save Personal Info
          </button>
        </div>
      </form>
    </div>
  );
}
