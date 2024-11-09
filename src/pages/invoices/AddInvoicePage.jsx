import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

export default function UpdateInvoiceComponent() {
    const navigate = useNavigate();
    const { invoiceId } = useParams();
    const [invoice, setInvoice] = useState({
        invoiceNumber: "",
        invoiceDate: "",
        invoiceDueDate: "",
        status: "Pending",
        subTotal: 0,
        totalTax: 0,
        discount: 0,
        total: 0,
        notes: "",
        clientId: "",
        shippingAddressId: "",
        invoiceItems: [],
    });
    const [clients, setClients] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetchInvoiceData();
        fetchClients();
        fetchProducts();
    }, []);

    const fetchInvoiceData = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/invoices/${invoiceId}`, {
                headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem("accesstoken"))}` },
            });
            if (response.data?.result?.invoice) {
                setInvoice(response.data.result.invoice);
                fetchClientsAddresses(response.data.result.invoice.clientId);
            }
        } catch (error) {
            console.error("Error fetching invoice data", error);
        }
    };

    const fetchClients = async () => {
        try {
            const response = await axios.get("http://localhost:3000/api/customers/fetch/id", {
                headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem("accesstoken"))}` },
            });
            if (response.status === 200) {
                setClients(response.data.clients);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await axios.get("http://localhost:3000/api/products/fetch/id", {
                headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem("accesstoken"))}` },
            });
            if (response.status === 200) {
                setProducts(response.data.result);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const fetchClientsAddresses = async (clientId) => {
        try {
            const response = await axios.get(`http://localhost:3000/api/customers/address/fetch/${clientId}`, {
                headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem("accesstoken"))}` },
            });
            if (response.status === 200) {
                setAddresses(response.data.result);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleClientChange = (event) => {
        const selectedClientId = event.target.value;
        setInvoice((prev) => ({ ...prev, clientId: selectedClientId }));
        fetchClientsAddresses(selectedClientId);
    };

    const handleAddressChange = (event) => {
        setInvoice((prev) => ({ ...prev, shippingAddressId: event.target.value }));
    };

    const handleInvoiceChanges = (event) => {
        const { name, value } = event.target;
        setInvoice((prev) => ({ ...prev, [name]: value }));
    };

    const handleItemChange = (index, field, value) => {
        const updatedItems = [...invoice.invoiceItems];
        updatedItems[index][field] = value;
        
        // Update the item details based on the selected product
        if (field === 'productId') {
            const selectedProduct = products.find(product => product.id === value);
            if (selectedProduct) {
                updatedItems[index] = {
                    ...updatedItems[index],
                    productName: selectedProduct.productName,
                    price: selectedProduct.price,
                    hsnCode: selectedProduct.hsnCode,
                    taxId: selectedProduct.taxId,
                    subTotal: updatedItems[index].quantity * selectedProduct.price,
                    totalPrice: updatedItems[index].quantity * selectedProduct.price // Update total price
                };
            }
        }

        setInvoice((prev) => ({
            ...prev,
            invoiceItems: updatedItems
        }));

        calculations(updatedItems);
    };

    const calculations = (updatedItems) => {
        const subTotal = updatedItems.reduce((acc, item) => acc + item.subTotal, 0);
        const totalTax = updatedItems.reduce((acc, item) => acc + item.taxableAmount || 0, 0);
        
        setInvoice((prev) => ({
            ...prev,
            subTotal,
            totalTax,
            total: subTotal - prev.discount
        }));
    };

    const addInvoiceItem = () => {
        setInvoice((prev) => ({
            ...prev,
            invoiceItems: [
                ...prev.invoiceItems,
                { productId: "", productName: "", quantity: 1, price: 0, subTotal: 0, taxableAmount: 0, totalPrice: 0 }
            ]
        }));
    };

    const removeInvoiceItem = (index) => {
        setInvoice((prev) => ({
            ...prev,
            invoiceItems: prev.invoiceItems.filter((_, i) => i !== index)
        }));
        
        calculations(invoice.invoiceItems.filter((_, i) => i !== index));
    };

    const handleOnSubmit = async (event) => {
        event.preventDefault();
        
        try {
            await axios.put(`http://localhost:3000/api/invoices/${invoiceId}`, invoice, {
                headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem("accesstoken"))}` },
            });
            toast.success("Invoice Updated Successfully");
            navigate("/invoices");
        } catch (error) {
            console.error(error.response.data);
            toast.error("Failed to update invoice");
        }
    };

    return (
      <div className="w-full max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Update Invoice</h2>
          <form onSubmit={handleOnSubmit}>
              <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                      <label htmlFor="client" className="block mb-1">Client*</label>
                      <select name="clientId" value={invoice.clientId} onChange={handleClientChange} className="w-full p-2 border border-gray-300 rounded" required>
                          <option value="">Select client</option>
                          {clients.map(client => (
                              <option key={client.id} value={client.id}>{client.firstName} {client.lastName}</option>
                          ))}
                      </select>
                  </div>
                  <div>
                      <label htmlFor="invoiceNumber" className="block mb-1">Invoice #*</label>
                      <input name="invoiceNumber" value={invoice.invoiceNumber} readOnly className="w-full p-2 border border-gray-300 rounded" type="text" />
                  </div>
                  <div>
                      <label htmlFor="invoiceDate" className="block mb-1">Invoice Date*</label>
                      <input type="date" name="invoiceDate" value={invoice.invoiceDate.split("T")[0]} onChange={handleInvoiceChanges} className="w-full p-2 border border-gray-300 rounded" required />
                  </div>
                  <div>
                      <label htmlFor="invoiceDueDate" className="block mb-1">Due Date*</label>
                      <input type="date" name="invoiceDueDate" value={invoice.invoiceDueDate.split("T")[0]} onChange={handleInvoiceChanges} className="w-full p-2 border border-gray-300 rounded" required />
                  </div>
              </div>

              <div className="mb-4 grid grid-cols-12 gap-3">
                  <div className="col-span-6">
                      <label htmlFor="shippingAddressId" className="block mb-1">Shipping Address*</label>
                      <select name="shippingAddressId" value={invoice.shippingAddressId} onChange={handleAddressChange} className="w-full p-2 border border-gray-300 rounded" required>
                          <option value="">Select address</option>
                          {addresses.map(address => (
                              <option key={address.id} value={address.id}>{address.address}</option>
                          ))}
                      </select>
                  </div>

                  <div className="col-span-6">
                      <label htmlFor="status" className="block mb-1">Status*</label>
                      <select name="status" value={invoice.status} onChange={handleInvoiceChanges} className="w-full p-2 border border-gray-300 rounded">
                          <option value="Pending">Pending</option>
                          <option value="Paid">Paid</option>
                          <option value="Partially_Paid">Partially Paid</option>
                      </select>
                  </div>
              </div>

              <div className="mb-4">
                  <label htmlFor="notes" className="block mb-1">Notes</label>
                  <textarea name="notes" value={invoice.notes} onChange={handleInvoiceChanges} className="w-full p-2 border border-gray-300 rounded" rows="2"></textarea>
              </div>

              <h3 className="text-xl font-semibold mb-4">Invoice Items</h3>

              {invoice.invoiceItems.map((item, index) => (
                  <div key={index} className="grid grid-cols-6 gap-4 items-center mb-4">
                      {/* Product Select */}
                      <select name={`productId-${index}`} value={item.productId} onChange={(e) => handleItemChange(index, 'productId', e.target.value)} className="col-span-2 w-full p-2 border border-gray-300 rounded">
                          <option value="">Select product</option>
                          {products.map(product => (
                              <option key={product.id} value={product.id}>{product.productName}</option>
                          ))}
                      </select>

                      {/* Quantity Input */}
                      <input type="number" name={`quantity-${index}`} value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', e.target.value)} className="col-span-1 w-full p-2 border border-gray-300 rounded" min="1" />

                      {/* Unit Price Display */}
                      <input type="number" value={item.price} readOnly className="col-span-1 w-full p-2 border border-gray-300 rounded" />

                      {/* Sub Total Display */}
                      <input type="number" value={item.subTotal} readOnly className="col-span-1 w-full p-2 border border-gray-300 rounded" />

                      {/* Tax Display */}
                      <input type="number" value={item.taxableAmount || 0} readOnly className="col-span-1 w-full p-2 border border-gray-300 rounded" />

                      {/* Total Amount Display with Remove Button */}
                      <div className="col-span-1 flex items-center space-x-2">
                          <input type="number" value={item.totalPrice} readOnly className="w-full p-2 border border-gray-300 rounded" />
                          {index > 0 && (
                              <button type='button' onClick={() => removeInvoiceItem(index)} className='text-red-600 hover:text-red-800'>
                                  <Trash2 />
                              </button>
                          )}
                      </div>
                  </div>
              ))}

              {/* Add Item Button */}
              <button type='button' onClick={addInvoiceItem} className='bg-blue-600 text-white w-full h-auto rounded hover:bg-blue-700 transition-colors duration-200'>
                  Add Item
              </button>

              {/* Save Invoice Button */}
              <button type='submit' className='bg-blue-600 text-white w-full h-auto mt-4 rounded hover:bg-blue-700 transition-colors duration-200'>
                  Save Invoice
              </button>

          </form>
      </div>
  );
}