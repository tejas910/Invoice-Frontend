import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const UpdateInvoicePage = () => {
  const { invoiceId } = useParams();
  const [invoiceData, setInvoiceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const accesstoken = JSON.parse(localStorage.getItem("accesstoken"));
  const navigate = useNavigate();

  useEffect(() => {
    fetchInvoiceData();
  }, []);

  const fetchInvoiceData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:3000/api/invoices/${invoiceId}`, {
        headers: { Authorization: `Bearer ${accesstoken}` },
      });
      if (res.status === 200) {
        console.log(res.data);
        
        setInvoiceData(res.data);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInvoiceData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...invoiceData.products];
    updatedProducts[index][field] = value;
    setInvoiceData((prevData) => ({
      ...prevData,
      products: updatedProducts,
    }));
  };

  const updateInvoice = async () => {
    try {
      const res = await axios.put(`http://localhost:3000/api/invoices/${invoiceId}`, invoiceData, {
        headers: { Authorization: `Bearer ${accesstoken}` },
      });
      if (res.status === 200) {
        
        alert('Invoice updated successfully!');
        navigate('/invoices');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to update invoice.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6">Update Invoice</h2>
      <div className="bg-white p-4 rounded-md shadow-md">
        <div className="mb-4">
          <label className="block text-gray-700">Client Name</label>
          <input
            type="text"
            name="clientName"
            value={invoiceData.clientName}
            onChange={handleInputChange}
            className="w-full border px-3 py-2 rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Invoice Date</label>
          <input
            type="date"
            name="invoiceDate"
            value={invoiceData.invoiceDate}
            onChange={handleInputChange}
            className="w-full border px-3 py-2 rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Due Date</label>
          <input
            type="date"
            name="dueDate"
            value={invoiceData.dueDate}
            onChange={handleInputChange}
            className="w-full border px-3 py-2 rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Status</label>
          <select
            name="status"
            value={invoiceData.status}
            onChange={handleInputChange}
            className="w-full border px-3 py-2 rounded-md"
          >
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
            <option value="Partially Paid">Partially Paid</option>
          </select>
        </div>

        {/* Product Table */}
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4">Products</h3>
          <table className="min-w-full bg-white rounded-lg shadow-md">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {invoiceData.products.map((product, index) => (
                <tr key={index}>
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      value={product.name}
                      onChange={(e) => handleProductChange(index, 'name', e.target.value)}
                      className="w-full border px-3 py-2 rounded-md"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      value={product.quantity}
                      onChange={(e) => handleProductChange(index, 'quantity', e.target.value)}
                      className="w-full border px-3 py-2 rounded-md"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      value={product.price}
                      onChange={(e) => handleProductChange(index, 'price', e.target.value)}
                      className="w-full border px-3 py-2 rounded-md"
                    />
                  </td>
                  <td className="px-4 py-2">{product.quantity * product.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6">
          <button
            onClick={updateInvoice}
            className="bg-blue-500 text-white px-6 py-2 rounded-md shadow-sm hover:bg-blue-600"
          >
            Update Invoice
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateInvoicePage;
