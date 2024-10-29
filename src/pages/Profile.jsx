import React from 'react';

const sampleData = {
  companyName: 'Sample Company Ltd.',
  companyPhone: '123-456-7890',
  street: '123 Sample Street',
  city: 'Sample City',
  state: 'Sample State',
  country: 'Sample Country',
  postCode: '12345',
  bankName: 'Sample Bank',
  bankAccountNumber: '0123456789',
  bankBranchName: 'Sample Branch',
  ifscCode: 'SAMP0000123',
  gstinNumber: '123456789012345',
  panNumber: 'ABCDE1234F',
  msmeNumber: 'MSME123456',
  userName: 'sampleuser',
  email: 'sample@example.com',
  companyLogo: 'https://via.placeholder.com/150',
  companyAuthorizedSign: 'https://via.placeholder.com/150',
  companyStamp: 'https://via.placeholder.com/150'
};

const Profile = () => {
  return (
    <div className="container mx-auto p-4 sm:p-6 bg-gray-50">
      <h1 className="text-2xl font-bold mb-6">Profile Information</h1>

      <h2 className="text-xl font-semibold mb-4">Company Information</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Company Name:</label>
          <input
            type="text"
            value={sampleData.companyName}
            readOnly
            className="mt-1 block w-full border rounded-md border-gray-300 px-4 py-2 bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Company Phone:</label>
          <input
            type="text"
            value={sampleData.companyPhone}
            readOnly
            className="mt-1 block w-full border rounded-md border-gray-300 px-4 py-2 bg-gray-100"
          />
        </div>
        <div className='flex justify-start flex-row'>
        <div>
          <label className="block text-sm font-medium text-gray-700"> Logo </label>
          <div className="flex items-center">
            <img src={sampleData.companyLogo} alt="Company Logo" className="h-20 w-20 object-cover rounded-full border border-gray-300 mr-4" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Signature</label>
          <div className="flex items-center">
            <img src={sampleData.companyAuthorizedSign} alt="Authorized Signature" className="h-20 w-20 object-cover rounded-full border border-gray-300 mr-4" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Stamp</label>
          <div className="flex items-center">
            <img src={sampleData.companyStamp} alt="Company Stamp" className="h-20 w-20 object-cover rounded-full border border-gray-300 mr-4" />
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
            value={sampleData.bankName}
            readOnly
            className="mt-1 block w-full border rounded-md border-gray-300 px-4 py-2 bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Account Number:</label>
          <input
            type="text"
            value={sampleData.bankAccountNumber}
            readOnly
            className="mt-1 block w-full border rounded-md border-gray-300 px-4 py-2 bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">IFSC Code:</label>
          <input
            type="text"
            value={sampleData.ifscCode}
            readOnly
            className="mt-1 block w-full border rounded-md border-gray-300 px-4 py-2 bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Branch Name:</label>
          <input
            type="text"
            value={sampleData.bankBranchName}
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
            value={sampleData.userName}
            readOnly
            className="mt-1 block w-full border rounded-md border-gray-300 px-4 py-2 bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">PAN Number:</label>
          <input
            type="text"
            value={sampleData.panNumber}
            readOnly
            className="mt-1 block w-full border rounded-md border-gray-300 px-4 py-2 bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email:</label>
          <input
            type="text"
            value={sampleData.email}
            readOnly
            className="mt-1 block w-full border rounded-md border-gray-300 px-4 py-2 bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">GST Number:</label>
          <input
            type="text"
            value={sampleData.gstinNumber}
            readOnly
            className="mt-1 block w-full border rounded-md border-gray-300 px-4 py-2 bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">MSME Number:</label>
          <input
            type="text"
            value={sampleData.msmeNumber}
            readOnly
            className="mt-1 block w-full border rounded-md border-gray-300 px-4 py-2 bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Street:</label>
          <input
            type="text"
            value={sampleData.street}
            readOnly
            className="mt-1 block w-full border rounded-md border-gray-300 px-4 py-2 bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">City:</label>
          <input
            type="text"
            value={sampleData.city}
            readOnly
            className="mt-1 block w-full border rounded-md border-gray-300 px-4 py-2 bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">State:</label>
          <input
            type="text"
            value={sampleData.state}
            readOnly
            className="mt-1 block w-full border rounded-md border-gray-300 px-4 py-2 bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Country:</label>
          <input
            type="text"
            value={sampleData.country}
            readOnly
            className="mt-1 block w-full border rounded-md border-gray-300 px-4 py-2 bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Post Code:</label>
          <input
            type="text"
            value={sampleData.postCode}
            readOnly
            className="mt-1 block w-full border rounded-md border-gray-300 px-4 py-2 bg-gray-100"
          />
        </div>
      </div>
    </div>
  );
};

export default Profile;
