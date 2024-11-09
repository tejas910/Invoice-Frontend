import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const UpdateInvoicePage = () => {
    const { invoiceId } = useParams();
    const navigate = useNavigate();
    const [invoiceData, setInvoiceData] = useState(null);
    const [clients, setClients] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [products, setProducts] = useState([]);
    const accesstoken = JSON.parse(localStorage.getItem("accesstoken"));

    useEffect(() => {
        const fetchInvoiceData = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/invoices/${invoiceId}`, {
                    headers: { Authorization: `Bearer ${accesstoken}` }
                });
                if (response.data?.result?.invoice) {
                    setInvoiceData(response.data.result.invoice);
                } else {
                    console.error("Invoice data is missing in the response");
                }
            } catch (error) {
                console.error("Error fetching invoice data", error);
            }
        };

        const fetchClients = async () => {
            try {
                const response = await axios.get("http://localhost:3000/api/customers/fetch/id", {
                    headers: { Authorization: `Bearer ${accesstoken}` }
                });
                setClients(response.data.clients);
            } catch (error) {
                console.error(error);
            }
        };

        const fetchProducts = async () => {
            try {
                const response = await axios.get("http://localhost:3000/api/products/fetch/id", {
                    headers: { Authorization: `Bearer ${accesstoken}` }
                });
                setProducts(response.data.result);
            } catch (error) {
                console.error(error);
            }
        };

        fetchInvoiceData();
        fetchClients();
        fetchProducts();
    }, [invoiceId]);

    const handleClientChange = async (event) => {
        const clientId = event.target.value;
        setInvoiceData((prev) => ({ ...prev, clientId }));
        if (clientId) {
            await fetchClientAddresses(clientId);
        }
    };

    const fetchClientAddresses = async (clientId) => {
        try {
            const response = await axios.get(`http://localhost:3000/api/customers/address/fetch/${clientId}`, {
                headers: { Authorization: `Bearer ${accesstoken}` }
            });
            if (response.status === 200) {
                setAddresses(response.data.result);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleAddressChange = (event) => {
        setInvoiceData((prev) => ({ ...prev, shippingAddressId: event.target.value }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInvoiceData(prev => ({ ...prev, [name]: value }));
    };

    const handleItemChange = (index, field, value) => {
        const updatedItems = invoiceData.invoiceItems.map((item, i) =>
            i === index ? { ...item, [field]: value } : item
        );
        setInvoiceData(prev => ({ ...prev, invoiceItems: updatedItems }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:3000/api/invoices/${invoiceId}`, invoiceData, {
                headers: { Authorization: `Bearer ${accesstoken}` }
            });
            toast.success("Invoice Updated Successfully");
            navigate("/invoices");
        } catch (error) {
            console.error("Error updating invoice", error);
            toast.error("Failed to update invoice");
        }
    };

    if (!invoiceData) return <div className="text-center mt-10">Loading...</div>;

    return (
        <div className="w-full max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Update Invoice</h2>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label htmlFor="client" className="block mb-1">Client*</label>
                        <select name="clientId" value={invoiceData.clientId} onChange={handleClientChange} className="w-full p-2 border border-gray-300 rounded" required>
                            <option value="">Select client</option>
                            {clients.map(client => (
                                <option key={client.id} value={client.id}>{client.firstName} {client.lastName}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="invoiceNumber" className="block mb-1">Invoice #*</label>
                        <input name="invoiceNumber" value={invoiceData.invoiceNumber} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded" type="text" readOnly />
                    </div>

                    <div>
                        <label htmlFor="invoiceDate" className="block mb-1">Invoice Date*</label>
                        <input type="date" name="invoiceDate" value={invoiceData.invoiceDate.split("T")[0]} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded" required />
                    </div>

                    <div>
                        <label htmlFor="invoiceDueDate" className="block mb-1">Due Date*</label>
                        <input type="date" name="invoiceDueDate" value={invoiceData.invoiceDueDate.split("T")[0]} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded" required />
                    </div>
                </div>

                <div className="mb-4 grid grid-cols-12 gap-3">
                    <div className="col-span-6">
                        <label htmlFor="shippingAddressId" className="block mb-1">Shipping Address*</label>
                        <select name="shippingAddressId" value={invoiceData.shippingAddressId} onChange={handleAddressChange} className="w-full p-2 border border-gray-300 rounded" required>
                            <option value="">Select address</option>
                            {addresses.map(address => (
                                <option key={address.id} value={address.id}>{address.address}</option>
                            ))}
                        </select>
                    </div>

                    <div className="col-span-6">
                        <label htmlFor="notes" className="block mb-1">Notes</label>
                        <textarea name="notes" value={invoiceData.notes} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded" rows="2"></textarea>
                    </div>
                </div>

                <h3 className="text-xl font-semibold mb-4">Invoice Items</h3>

                {invoiceData.invoiceItems.map((item, index) => (
                    <div key={index} className="grid grid-cols-6 gap-4 items-center mb-4">
                        {/* Product Select */}
                        <select
                            name={`productId-${index}`}
                            value={item.productId}
                            onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                            className="col-span-2 w-full p-2 border border-gray-300 rounded"
                        >
                            <option value="">Select product</option>
                            {products.map(product => (
                                <option key={product.id} value={product.id}>{product.productName}</option>
                            ))}
                        </select>

                        {/* Quantity Input */}
                        <input
                            type="number"
                            name={`quantity-${index}`}
                            value={item.quantity}
                            onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                            className="col-span-1 w-full p-2 border border-gray-300 rounded"
                            min="1"
                        />

                        {/* Unit Price Display */}
                        <input
                            type="number"
                            value={item.price}
                            readOnly
                            className="col-span-1 w-full p-2 border border-gray-300 rounded"
                        />

                        {/* Sub Total Display */}
                        <input
                            type="number"
                            value={item.subTotal}
                            readOnly
                            className="col-span-1 w-full p-2 border border-gray-300 rounded"
                        />

                        {/* Total Amount Display */}
                        <input
                            type="number"
                            value={item.totalPrice}
                            readOnly
                            className="col-span-1 w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                ))}

                {/* Submit Button */}
                <button type="submit" className="bg-blue-600 text-white w-full h-10 rounded hover:bg-blue-700 transition-colors duration-200">
                    Update Invoice
                </button>
            </form>
        </div>
    );
};

export default UpdateInvoicePage;