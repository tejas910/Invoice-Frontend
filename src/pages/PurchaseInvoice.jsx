import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Mock data for initial purchase invoices
const initialInvoices = [
  { id: '1', productName: 'Laptop', sellerName: 'Tech Store', invoiceNumber: 'INV001', priceOfEachItem: 50000, totalCost: 50000, purchaseDate: '2024-01-15', quantity: 1 },
  { id: '2', productName: 'Monitor', sellerName: 'Display Shop', invoiceNumber: 'INV002', priceOfEachItem: 15000, totalCost: 30000, purchaseDate: '2024-01-18', quantity: 2 },
  { id: '3', productName: 'Keyboard', sellerName: 'Peripherals Inc.', invoiceNumber: 'INV003', priceOfEachItem: 1200, totalCost: 1200, purchaseDate: '2024-01-20', quantity: 1 },
  // Add more invoices as needed
];

export default function PurchaseInvoice() {
  const [invoices, setInvoices] = useState(initialInvoices);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(5);
  const [sortOrder, setSortOrder] = useState('asc'); // asc or desc
  const navigate = useNavigate();

  const filteredInvoices = invoices
    .filter(invoice =>
      invoice.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.productName.localeCompare(b.productName);
      } else {
        return b.productName.localeCompare(a.productName);
      }
    });

  const indexOfLastInvoice = currentPage * resultsPerPage;
  const indexOfFirstInvoice = indexOfLastInvoice - resultsPerPage;
  const currentInvoices = filteredInvoices.slice(indexOfFirstInvoice, indexOfLastInvoice);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  const handleAddInvoice = () => {
    navigate("/addpurchaseinvoice");
  };

  const handleEditInvoice = (id) => {
    // Implement edit invoice functionality
    console.log('Edit invoice', id);
  };

  const handleDeleteInvoice = (id) => {
    setInvoices(invoices.filter(invoice => invoice.id !== id));
    console.log('Delete invoice', id);
  };

  const handleSort = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(filteredInvoices.length / resultsPerPage);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="pl-10 pr-4 py-2 border rounded-md w-64"
            value={searchTerm}
            onChange={handleSearch}
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        <button
          onClick={handleAddInvoice}
          className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Invoice
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center cursor-pointer" onClick={handleSort}>
                  Product Name
                  {sortOrder === 'asc' ? ' 🔼' : ' 🔽'}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Seller Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Invoice Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price Each
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Cost
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Purchase Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentInvoices.map((invoice) => (
              <tr key={invoice.id}>
                <td className="px-6 py-4 whitespace-nowrap">{invoice.productName}</td>
                <td className="px-6 py-4 whitespace-nowrap">{invoice.sellerName}</td>
                <td className="px-6 py-4 whitespace-nowrap">{invoice.invoiceNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap">{invoice.priceOfEachItem.toFixed(2)} /-</td>
                <td className="px-6 py-4 whitespace-nowrap">{invoice.quantity}</td>
                <td className="px-6 py-4 whitespace-nowrap">{invoice.totalCost.toFixed(2)} /-</td>
                <td className="px-6 py-4 whitespace-nowrap">{new Date(invoice.purchaseDate).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleEditInvoice(invoice.id)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteInvoice(invoice.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div>
          <span className="mr-2">Show</span>
          <select
            value={resultsPerPage}
            onChange={(e) => {
              setResultsPerPage(Number(e.target.value));
              setCurrentPage(1); // Reset to first page on change
            }}
            className="border border-gray-300 rounded-md p-1"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
          </select>
          <span className="ml-2">results per page</span>
        </div>
        <div>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={`px-2 py-1 border rounded-md ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'}`}
            >
              {index + 1}
            </button>
          ))}
        </div>
        <div>Showing {currentInvoices.length} of {filteredInvoices.length} results</div>
      </div>
    </div>
  );
}
