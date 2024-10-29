
import { useState } from 'react';
import axios from 'axios';

export default function AddPurchaseInvoice() {
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [invoiceDate, setInvoiceDate] = useState('');
  const [sellerName, setSellerName] = useState('Dark Minds');
  const [sellerAddress, setSellerAddress] = useState('ABC road, pune, 411048.');
  const [notes, setNotes] = useState('');
  const [discount, setDiscount] = useState(0);
  const [invoiceItems, setInvoiceItems] = useState([{ productName: '', price: 0, quantity: 1, productDescription: '', hsnCode: '' }]);
  const accesstoken = JSON.parse(localStorage.getItem("accesstoken"));
  const addItem = () => {
    setInvoiceItems([...invoiceItems, { productName: '', price: 0, quantity: 1, productDescription: '', hsnCode: '' }]);
  };

  const removeItem = (index) => {
    setInvoiceItems(invoiceItems.filter((_, i) => i !== index));
  };

  const calculateSubtotal = () => {
    return invoiceItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateTotalTax = () => {
    // Example tax calculation (modify as needed)
    const subtotal = calculateSubtotal();
    const taxRate = 0.1; // 10% tax
    return (subtotal * taxRate).toFixed(2);
  };

  const calculateTotal = () => {
    const subtotal = Number(calculateSubtotal());
    const tax = Number(calculateTotalTax());
    return (subtotal + tax - discount)
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const invoiceData = {
      invoiceNumber,
      invoiceDate,
      sellerName,
      sellerAddress,
      total: Number(calculateTotal()),
      subTotal: Number(calculateSubtotal()),
      discount,
      totalTax: Number(calculateTotalTax()),
      notes,
      invoiceItems: invoiceItems.map(item => ({
        productName: item.productName,
        productDescription: item.productDescription,
        hsnCode: item.hsnCode,
        price: Number(item.price),
        quantity: Number(item.quantity),
        totalPrice: Number((item.price * item.quantity)),
        subTotal: Number(item.price * item.quantity ), // example discount applied
        taxableAmount: Number((item.price * item.quantity * 0.1)), // example tax calculation
      })),
    };

    try {
      const response = await axios.post('http://localhost:3000/api/purchase-invoices', invoiceData, {headers:{Authorization:`Bearer ${accesstoken}`}});
      if(response.status==200){
        console.log('Invoice saved:', response.data);
        alert('Invoice submitted successfully!');
      }
      // Optionally, you can generate a PDF here
    } catch (error) {
      console.error('Error submitting invoice:', error);
      alert('Failed to submit invoice. Please try again.');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Purchase Invoice</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block mb-1">Invoice #</label>
            <input
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              type="text"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Invoice Date</label>
            <input
              type="date"
              value={invoiceDate}
              onChange={(e) => setInvoiceDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Seller Name</label>
            <input
              value={sellerName}
              onChange={(e) => setSellerName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              type="text"
            />
          </div>
          <div>
            <label className="block mb-1">Seller Address</label>
            <input
              value={sellerAddress}
              onChange={(e) => setSellerAddress(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              type="text"
            />
          </div>
          <div>
            <label className="block mb-1">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              rows="3"
            />
          </div>
          <div>
            <label className="block mb-1">Discount</label>
            <input
              type="number"
              value={discount}
              onChange={(e) => setDiscount(Number(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        </div>

        <table className="w-full mb-4 border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-left border border-gray-300 p-2">#</th>
              <th className="text-left border border-gray-300 p-2">Product Name</th>
              <th className="text-left border border-gray-300 p-2">Description</th>
              <th className="text-left border border-gray-300 p-2">HSN Code</th>
              <th className="text-left border border-gray-300 p-2">Qty</th>
              <th className="text-left border border-gray-300 p-2">Unit Price</th>
              <th className="text-left border border-gray-300 p-2">Total Price</th>
              <th className="text-left border border-gray-300 p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {invoiceItems.map((item, index) => (
              <tr key={index}>
                <td className="border border-gray-300 p-2">{index + 1}</td>
                <td className="border border-gray-300 p-2">
                  <input
                    type="text"
                    value={item.productName}
                    onChange={(e) => {
                      const newItems = [...invoiceItems];
                      newItems[index].productName = e.target.value;
                      setInvoiceItems(newItems);
                    }}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </td>
                <td className="border border-gray-300 p-2">
                  <input
                    type="text"
                    value={item.productDescription}
                    onChange={(e) => {
                      const newItems = [...invoiceItems];
                      newItems[index].productDescription = e.target.value;
                      setInvoiceItems(newItems);
                    }}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </td>
                <td className="border border-gray-300 p-2">
                  <input
                    type="text"
                    value={item.hsnCode}
                    onChange={(e) => {
                      const newItems = [...invoiceItems];
                      newItems[index].hsnCode = e.target.value;
                      setInvoiceItems(newItems);
                    }}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </td>
                <td className="border border-gray-300 p-2">
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => {
                      const newItems = [...invoiceItems];
                      newItems[index].quantity = Math.max(1, e.target.value);
                      setInvoiceItems(newItems);
                    }}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </td>
                <td className="border border-gray-300 p-2">
                  <input
                    type="number"
                    value={item.price}
                    onChange={(e) => {
                      const newItems = [...invoiceItems];
                      newItems[index].price = Math.max(0, e.target.value);
                      setInvoiceItems(newItems);
                    }}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </td>
                <td className="border border-gray-300 p-2">
                  <input
                    type="number"
                    value={(item.price * item.quantity).toFixed(2)}
                    readOnly
                    className="w-full p-2 border border-gray-300 rounded bg-gray-100"
                  />
                </td>
                <td className="border border-gray-300 p-2">
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button type="button" onClick={addItem} className="mb-4 bg-blue-500 text-white p-2 rounded">
          Add Item
        </button>

        <div className="flex justify-between mt-4">
          <div>
            <p className="font-semibold">Subtotal: {calculateSubtotal()}</p>
            <p className="font-semibold">Total Tax: {calculateTotalTax()}</p>
            <p className="font-semibold">Total: {calculateTotal()}</p>
          </div>
          <button type="submit" className="bg-green-500 text-white p-1 rounded">Submit Invoice</button>
        </div>
      </form>
    </div>
  );
}
