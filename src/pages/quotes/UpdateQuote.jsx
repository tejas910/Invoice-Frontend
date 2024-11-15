import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

function UpdateQuote() {
  const navigate = useNavigate();
  const { quoteId } = useParams();
  const [invoice, setInvoice] = useState({
    quoteNumber: "",
    quoteDate: "",
    quoteDueDate: "",
    status: "Draft",
    subTotal: 0,
    totalTax: 0,
    discount: 0,
    total: 0,
    notes: "",
    clientId: "",
    shippingAddressId: "",
    quoteItems: [],
  });
  const [quoteItems, setInvoiceItems] = useState([
    {
      productName: "",
      hsnCode: "",
      price: 0,
      quantity: 1,
      taxableAmount: 0,
      subTotal: 0,
      totalPrice: 0,
      taxId: "",
      productId: "",
    },
  ]);
  const [client, setClient] = useState({
    id: "",
  });

  const [products, setProducts] = useState([
    {
      id: "",
      productName: "",
      price: 0,
      taxAmount: 0,
      subTotal: 0,
      hsnCode: "",
      taxId: "",
    },
  ]);
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    fetchQuoteeData();
    fetchProducts();
  }, [quoteId]);
  console.log(quoteId);

  const fetchQuoteeData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/quotes/${quoteId}`,
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(
              localStorage.getItem("accesstoken")
            )}`,
          },
        }
      );
      if (response.status === 200) {
        setInvoiceItems(response.data.result.quote.quoteItems);
        setInvoice(response.data.result.quote);
        setClient(response.data.result.quote.client);
        fetchClientAddresses(response.data.result.quote.client.id);
      }
    } catch (error) {
      console.error("Error fetching invoice data", error);
      toast.error("Failed to fetch invoice data");
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/products/fetch/id",
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(
              localStorage.getItem("accesstoken")
            )}`,
          },
        }
      );
      if (response.status === 200) {
        setProducts(response.data.result);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch products");
    }
  };

  const fetchClientAddresses = async (clientId) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/customers/address/fetch/${clientId}`,
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(
              localStorage.getItem("accesstoken")
            )}`,
          },
        }
      );
      if (response.status === 200) {
        setInvoice((prev) => ({
          ...prev,
          clientId: clientId,
        }));
        setAddresses(response.data.result);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch client addresses");
    }
  };

  const handleAddressChange = (event) => {
    setInvoice((prev) => ({
      ...prev,
      shippingAddressId: event.target.value,
    }));
  };

  const handleInvoiceChanges = (event) => {
    const { value, name } = event.target;

    // Check if the field is a date input
    if (name === "quoteDate" || name === "quoteDueDate") {
      // Create a DateTime string (you can adjust the time as needed)
      const dateTimeString = new Date(`${value}T00:00:00`).toISOString();
      setInvoice((prev) => ({
        ...prev,
        [name]: dateTimeString, // Store the complete DateTime
      }));
    } else if (name === "discount") {
      const total = quoteItems.reduce((acc, item) => acc + item.totalPrice, 0);
      setInvoice((prev) => ({
        ...prev,
        discount: Number(value),
        total: total - Number(value),
      }));
    } else {
      setInvoice((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleInvoiceItemsChanges = (event, index) => {
    const { value, name } = event.target;

    setInvoiceItems((prevItems) => {
      const updatedItems = [...prevItems];
      const newQuantity =
        name === "quantity"
          ? Math.max(1, Number(value))
          : updatedItems[index].quantity;

      // Update the item with the new value
      updatedItems[index] = {
        ...updatedItems[index],
        [name]: name === "quantity" ? newQuantity : value,
      };

      // Get the selected product by productId
      const selectedProduct = products.find(
        (product) => product.id === updatedItems[index].productId
      );

      if (selectedProduct) {
        const subTotal = selectedProduct.subTotal * newQuantity;
        const taxableAmount = selectedProduct.taxAmount * newQuantity;
        const totalPrice = subTotal + taxableAmount;
        const price = selectedProduct.price;

        updatedItems[index] = {
          ...updatedItems[index],
          productName: selectedProduct.productName,
          hsnCode:
            selectedProduct.hsnCode !== undefined
              ? selectedProduct.hsnCode
              : "",
          price: price,
          quantity: newQuantity,
          subTotal: subTotal,
          taxableAmount: taxableAmount,
          totalPrice: totalPrice,
          taxId: selectedProduct.taxId,
        };
      }

      setInvoice((prev) => ({
        ...prev,
        quoteItems: updatedItems,
      }));
      // Return the updated items array
      return updatedItems;
    });

    // Calculate invoice totals after updating items
    calculations();
  };

  const calculations = () => {
    setInvoiceItems((prevItems) => {
      const subTotal = prevItems.reduce((acc, item) => acc + item.subTotal, 0);
      const totalTax = prevItems.reduce(
        (acc, item) => acc + item.taxableAmount,
        0
      );
      const total = prevItems.reduce((acc, item) => acc + item.totalPrice, 0);
      setInvoice((prev) => ({
        ...prev,
        subTotal: subTotal,
        totalTax: totalTax,
        total: total - prev.discount,
      }));

      return prevItems;
    });
  };

  const addInvoiceItem = () => {
    setInvoiceItems((prevItems) => [
      ...prevItems,
      {
        productId: "",
        productName: "",
        quantity: 1,
        price: 0,
        subTotal: 0,
        taxableAmount: 0,
        totalPrice: 0,
        productDescription: "",
        hsnCode: "",
        taxId: "",
      },
    ]);
  };

  const removeInvoiceItem = (index) => {
    setInvoiceItems((prevItems) => {
      if (prevItems.length > 1) {
        const updatedItems = prevItems.filter((_, i) => i !== index);
        const subTotal = updatedItems.reduce(
          (acc, item) => acc + item.subTotal,
          0
        );
        const totalTax = updatedItems.reduce(
          (acc, item) => acc + item.taxableAmount,
          0
        );
        const total = updatedItems.reduce(
          (acc, item) => acc + item.totalPrice,
          0
        );
        setInvoice((prev) => ({
          ...prev,
          subTotal: subTotal,
          totalTax: totalTax,
          total: total - prev.discount,
        }));

        return updatedItems;
      }
      return prevItems; // Do not remove if only one item exists
    });
  };

  const handleOnSubmit = async (event) => {
    event.preventDefault();
    const cleanedInvoice = {
      ...invoice,
      quoteItems: quoteItems.map(({ tax, ...rest }) => rest),
    };
    try {
      if (invoice.status === "Converted_To_Invoice") {
        const res = await axios.post(
          `http://localhost:3000/api/quotes/quote-to-invoice/${quoteId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${JSON.parse(
                localStorage.getItem("accesstoken") || ""
              )}`,
            },
          }
        );
      }
      const response = await axios.put(
        `http://localhost:3000/api/quotes/${quoteId}`,
        cleanedInvoice,
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(
              localStorage.getItem("accesstoken") || ""
            )}`,
          },
        }
      );
      if (response.status === 200) {
        navigate("/quotes");
        toast.success("Invoice Updated.");
      }
    } catch (error) {
      console.error(error.response.data);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Update Quote</h2>
      <form
        onSubmit={(event) => {
          handleOnSubmit(event);
        }}
      >
        {/* General Information - grid-cols-2 for two column layout */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="client" className="block mb-1">
              Client*
            </label>
            <input
              name="clientDetails"
              value={client.firstName + " " + client.lastName}
              className="w-full p-2 border border-gray-300 rounded"
              type="text"
              readOnly
            />
          </div>
          <div>
            <label htmlFor="quoteNumber" className="block mb-1">
              Invoice #*
            </label>
            <input
              name="quoteNumber"
              value={invoice.quoteNumber}
              className="w-full p-2 border border-gray-300 rounded"
              type="text"
              readOnly
            />
          </div>

          <div>
            <label htmlFor="quoteDate" className="block mb-1">
              Invoice Date*
            </label>
            <input
              type="date"
              name="quoteDate"
              value={invoice.quoteDate.split("T")[0]}
              onChange={handleInvoiceChanges}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div>
            <label htmlFor="quoteDueDate" className="block mb-1">
              Due Date*
            </label>
            <input
              type="date"
              name="quoteDueDate"
              value={invoice.quoteDueDate.split("T")[0]}
              onChange={handleInvoiceChanges}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
        </div>

        {/* Address and Status grid layout (grid-cols-12 for 2 large fields) */}
        <div className="grid grid-cols-12 gap-4 mb-4">
          {/* Shipping Address */}
          <div className="col-span-6">
            <label htmlFor="address" className="block mb-1">
              Shipping Address*
            </label>
            <select
              name="shippingAddressId"
              value={invoice.shippingAddressId}
              onChange={handleAddressChange}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">Select address</option>
              {addresses.map((address) => (
                <option key={address.id} value={address.id}>
                  {address.address}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div className="col-span-6">
            <label htmlFor="status" className="block mb-1">
              Status*
            </label>
            <select
              name="status"
              value={invoice.status}
              onChange={handleInvoiceChanges}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="Draft">Draft</option>
              <option value="Accepted">Accepted</option>
              <option value="Declined">Declined</option>
              <option value="Converted_To_Invoice">Converted To Invoice</option>
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="notes" className="block mb-1">
            Notes
          </label>
          <textarea
            name="notes"
            value={invoice.notes}
            onChange={handleInvoiceChanges}
            className="w-full p-2 border border-gray-300 rounded"
            rows="2"
          />
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Invoice Items</h3>
          {quoteItems.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-6 gap-4 items-center mb-4"
            >
              {/* Product Select */}
              <div className="col-span-1">
                <label className="block mb-1 text-sm font-medium">
                  Product*
                </label>
                <select
                  name="productId"
                  value={item.productId}
                  onChange={(event) => handleInvoiceItemsChanges(event, index)}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="">Select a Product</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.productName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quantity Input */}
              <div className="col-span-1">
                <label className="block mb-1 text-sm font-medium">
                  Quantity*
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={item.quantity}
                  onChange={(event) => handleInvoiceItemsChanges(event, index)}
                  className="w-full p-2 border border-gray-300 rounded"
                  min="1"
                  placeholder="1"
                />
              </div>

              {/* Unit Price Display */}
              <div className="col-span-1">
                <label className="block mb-1 text-sm font-medium">
                  Unit Price
                </label>
                <input
                  type="number"
                  value={item.price}
                  className="w-full p-2 border border-gray-300 rounded"
                  readOnly
                />
              </div>

              {/* Sub Total Display */}
              <div className="col-span-1">
                <label className="block mb-1 text-sm font-medium">
                  Sub Total
                </label>
                <input
                  type="number"
                  value={item.subTotal}
                  className="w-full p-2 border border-gray-300 rounded"
                  readOnly
                />
              </div>

              {/* Tax Display */}
              <div className="col-span-1">
                <label className="block mb-1 text-sm font-medium">Tax</label>
                <input
                  type="number"
                  value={item.taxableAmount}
                  className="w-full p-2 border border-gray-300 rounded"
                  readOnly
                />
              </div>

              {/* Total Amount Display with Remove Button */}
              <div className="col-span-1 flex items-center space-x-2">
                <div className="flex-1">
                  <label className="block mb-1 text-sm font-medium">
                    Total Amount
                  </label>
                  <input
                    type="number"
                    value={item.totalPrice}
                    className="w-full p-2 border border-gray-300 rounded"
                    readOnly
                  />
                </div>
                <div className="flex justify-center items-end h-12">
                  <button
                    type="button"
                    onClick={() => removeInvoiceItem(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 />
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div className="grid grid-cols-12 gap-4">
            {/* Left Section: Add Item and Discount */}
            <div className="col-span-6 space-y-4">
              <div>
                <button
                  type="button"
                  onClick={addInvoiceItem}
                  className="bg-blue-600 text-white w-32 h-10 rounded hover:bg-blue-700 transition-colors duration-200"
                >
                  Add Item
                </button>
              </div>

              {/* Discount Section */}
              <div>
                <label
                  htmlFor="discount-input"
                  className="block mb-2 text-sm font-medium"
                >
                  Discount
                </label>
                <div className="relative mb-6 w-3/4">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-5 h-5 text-gray-500"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 8.25H9m6 3H9m3 6-3-3h1.5a3 3 0 1 0 0-6M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      />
                    </svg>
                  </div>
                  <input
                    type="number"
                    id="discount-input"
                    name="discount"
                    value={invoice.discount}
                    onChange={handleInvoiceChanges}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
                    placeholder="Enter discount amount"
                  />
                </div>
                <div className="pt-2 flex items-center gap-5">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white w-32 h-11 rounded hover:bg-blue-700 transition-colors duration-200"
                  >
                    Save Invoice
                  </button>
                  <button
                    type="button"
                    className="bg-gray-500 text-white w-32 h-11 rounded hover:bg-gray-600 transition-colors duration-200"
                    onClick={() => navigate("/")}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>

            {/* Right Section: Invoice Summary */}
            <div className="col-span-6">
              <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                <h4 className="text-lg font-semibold text-gray-800 mb-3">
                  Invoice Summary
                </h4>
                <div className="text-gray-700 space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Sub Total:</span>
                    <span>{invoice.subTotal} Rs</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Total Tax:</span>
                    <span>{invoice.totalTax} Rs</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Discount:</span>
                    <span>{invoice.discount} Rs</span>
                  </div>
                  <hr className="my-2 border-gray-200" />
                  <div className="flex justify-between text-gray-800 font-bold text-lg">
                    <span>Invoice Total:</span>
                    <span>{invoice.total} Rs</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default UpdateQuote;
