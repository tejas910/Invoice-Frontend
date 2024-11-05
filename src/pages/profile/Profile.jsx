import axios from 'axios';
import React, { useEffect, useState } from 'react';

const Profile = () => {
  const[profileData,setProfileData] = useState();
  const accesstoken = JSON.parse(localStorage.getItem('accesstoken'));
      const fetchDetails = async() =>{  

          try{
            const res = await axios.get(`http://localhost:3000/api/users`,
              {
                headers:{
                  Authorization:`Bearer ${accesstoken}`
                }
              }
            )
            if(res.status==200){
              // console.log(res.data.user)
              setProfileData(res.data.user || {})
            }
          }catch(err){
            if(axios.isAxiosError(err)){
              console.log(err.response?.data.message)
            }
          }
      }
      // console.log(profileData.companyName)
      useEffect(()=>{
        fetchDetails();
      },[])

      if(!profileData) return <h1 className='text-blue-400'>Loading....</h1>
  return (
    <div className="container mx-auto p-4 sm:p-6 bg-gray-50">
      <h1 className="text-2xl font-bold mb-6">Profile Information</h1>

      <h2 className="text-xl font-semibold mb-4">Company Information</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Company Name:</label>
          <input
            type="text"
            value={profileData.companyName}
            readOnly
            className="mt-1 block w-full border rounded-md border-gray-300 px-4 py-2 bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Company Phone:</label>
          <input
            type="text"
            value={profileData.companyPhone}
            readOnly
            className="mt-1 block w-full border rounded-md border-gray-300 px-4 py-2 bg-gray-100"
          />
        </div>
        <div className='flex justify-evenly items-center flex-row'>
        <div className='h-40'>
          <label className="block text-sm font-medium text-gray-700 mb-2"> Logo </label>
          <div className="flex items-center">
            <img src={profileData.companyLogo} alt="Company Logo" className="h-30 w-40 object-cover rounded border mr-4" />
          </div>
        </div>
        <div className='h-40'>
          <label className="block text-sm font-medium text-gray-700 mb-2">Signature</label>
          <div className="flex items-center">
            <img src={profileData.companyAuthorizedSign} alt="Authorized Signature" className="h-30 w-40 object-cover rounded mr-4" />
          </div>
        </div>
        <div className='h-40'>
          <label className="block text-sm font-medium text-gray-700 mb-2">Stamp</label>
          <div className="flex items-center">
            <img src={profileData.companyStamp} alt="Company Stamp" className="h-30 w-40 object-cover rounded mr-4" />
          </div>
        </div>
        </div>
      </div>

      <h2 className="text-xl font-semibold mt-8 mb-4">Bank Details</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Bank Name:</label>
          <input
            type="text"
            value={profileData.bankName}
            readOnly
            className="mt-1 block w-full border rounded-md border-gray-300 px-4 py-2 bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Account Number:</label>
          <input
            type="text"
            value={profileData.bankAccountNumber}
            readOnly
            className="mt-1 block w-full border rounded-md border-gray-300 px-4 py-2 bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">IFSC Code:</label>
          <input
            type="text"
            value={profileData.ifscCode}
            readOnly
            className="mt-1 block w-full border rounded-md border-gray-300 px-4 py-2 bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Branch Name:</label>
          <input
            type="text"
            value={profileData.bankBranchName}
            readOnly
            className="mt-1 block w-full border rounded-md border-gray-300 px-4 py-2 bg-gray-100"
          />
        </div>
      </div>

      <h2 className="text-xl font-semibold mt-8 mb-4">Personal Information</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Username:</label>
          <input
            type="text"
            value={profileData.userName}
            readOnly
            className="mt-1 block w-full border rounded-md border-gray-300 px-4 py-2 bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">PAN Number:</label>
          <input
            type="text"
            value={profileData.panNumber}
            readOnly
            className="mt-1 block w-full border rounded-md border-gray-300 px-4 py-2 bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email:</label>
          <input
            type="text"
            value={profileData.email}
            readOnly
            className="mt-1 block w-full border rounded-md border-gray-300 px-4 py-2 bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">GST Number:</label>
          <input
            type="text"
            value={profileData.gstinNumber}
            readOnly
            className="mt-1 block w-full border rounded-md border-gray-300 px-4 py-2 bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">MSME Number:</label>
          <input
            type="text"
            value={profileData.msmeNumber}
            readOnly
            className="mt-1 block w-full border rounded-md border-gray-300 px-4 py-2 bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Street:</label>
          <input
            type="text"
            value={profileData.street}
            readOnly
            className="mt-1 block w-full border rounded-md border-gray-300 px-4 py-2 bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">City:</label>
          <input
            type="text"
            value={profileData.city}
            readOnly
            className="mt-1 block w-full border rounded-md border-gray-300 px-4 py-2 bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">State:</label>
          <input
            type="text"
            value={profileData.state}
            readOnly
            className="mt-1 block w-full border rounded-md border-gray-300 px-4 py-2 bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Country:</label>
          <input
            type="text"
            value={profileData.country}
            readOnly
            className="mt-1 block w-full border rounded-md border-gray-300 px-4 py-2 bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Post Code:</label>
          <input
            type="text"
            value={profileData.postCode}
            readOnly
            className="mt-1 block w-full border rounded-md border-gray-300 px-4 py-2 bg-gray-100"
          />
        </div>
      </div>
    </div>
  );
};

export default Profile;
