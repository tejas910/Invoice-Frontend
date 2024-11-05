export const AddressInfo = ({ user, client, shippingAddress }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
    <div className="bg-gray-50 p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">From:</h2>
      <p className="font-medium">{user.companyName}</p>
      <p className="text-sm text-gray-600">{user.street},</p>
      <p className="text-sm text-gray-600">{`${user.city}, ${user.state}, ${user.country} - ${user.postCode}`}</p>
      <p className="text-sm text-gray-600 mt-2">
        GSTIN: <b>{user.gstinNumber}</b>
      </p>
      <p className="text-sm text-gray-600">
        PAN NO: <b>{user.panNumber}</b>
      </p>
    </div>

    <div className="bg-gray-50 p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">To:</h2>
      <p className="font-medium">{client.companyName}</p>
      <p className="text-sm text-gray-600">
        Name: {`${client.firstName} ${client.lastName}`}
      </p>
      <p className="text-sm text-gray-600">Email: {client.email}</p>
      <p className="text-sm text-gray-600">Phone No: {client.phoneNo}</p>
      <p className="text-sm text-gray-600 mt-2">
        GSTIN: <b>{client.clientGstinNumber}</b>
      </p>
    </div>

    <div className="bg-gray-50 p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">
        Shipping Address:
      </h2>
      <p className="text-sm text-gray-600">{shippingAddress.street},</p>
      <p className="text-sm text-gray-600">{`${shippingAddress.city}, ${shippingAddress.state}, ${shippingAddress.country} - ${shippingAddress.postCode}`}</p>
    </div>
  </div>
);
