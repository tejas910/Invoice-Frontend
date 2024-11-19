import React, { useEffect, useState } from 'react';
import { Search, Plus, Edit, Trash2, ChevronDown, Car } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { parseISO } from 'date-fns';


export default function PurchaseInvoice() {
  const [invoices, setInvoices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(5);
  const [sortOrder, setSortOrder] = useState('asc'); // asc or desc
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  const filteredInvoices = invoices
  .filter(invoice =>
    (invoice.productName && invoice.productName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (invoice.invoiceNumber && invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()))
  )
  .sort((a, b) => {
    if (sortOrder === 'asc') {
      return (a.productName || "").localeCompare(b.productName || "");
    } else {
      return (b.productName || "").localeCompare(a.productName || "");
    }
  });
  const indexOfLastInvoice = currentPage * resultsPerPage;
  const indexOfFirstInvoice = indexOfLastInvoice - resultsPerPage;
  const currentInvoices = filteredInvoices.slice(indexOfFirstInvoice, indexOfLastInvoice);
  const accesstoken = JSON.parse(localStorage.getItem('accesstoken'))
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  const fetchPurchaseInvoice = async() =>{
    setLoading(true); // Start loading
    try{
      const res = await axios.get(`http://localhost:3000/api/purchase-invoices`,{headers:{
        Authorization:`Bearer ${accesstoken}`
      }})
      if(res.status==200){
        console.log(res.data)
        setInvoices(res.data.result || [])
      }
    }catch(err){
      if(axios.isAxiosError(err)){
        console.log(err.response?.data.message)
      }
    }
    finally{
      setLoading(false); // End loading
    }
  }

  useEffect(()=>{
    fetchPurchaseInvoice();
  },[])

  const handleAddInvoice = () => {
    navigate("/addpurchaseinvoice");
  };

  const handleEditInvoice = (id) => {
    // Implement edit invoice functionality
    console.log('Edit invoice', id);
  };

  const handleDeleteInvoice = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success"
        });
        setInvoices(invoices.filter(invoice => invoice.id !== id));
        console.log('Delete invoice', id);
      }
    });
  };


  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };


  const totalPages = Math.ceil(filteredInvoices.length / resultsPerPage);


  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );


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
              {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center cursor-pointer" onClick={handleSort}>
                  Product Name
                  {sortOrder === 'asc' ? ' 🔼' : ' 🔽'}
                </div>
              </th> */}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Seller Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Invoice Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantity
              </th> */}
              {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Cost
              </th> */}
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
                {/* <td className="px-6 py-4 whitespace-nowrap">{invoice.productName}</td> */}
                <td className="px-6 py-4 whitespace-nowrap">{invoice.sellerName}</td>
                <td className="px-6 py-4 whitespace-nowrap">{invoice.invoiceNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap">{invoice.total} /-</td>
                {/* <td className="px-6 py-4 whitespace-nowrap">{invoice.quantity}</td> */}
                {/* <td className="px-6 py-4 whitespace-nowrap">{invoice.totalCost.toFixed(2)} /-</td> */}
                <td className="px-6 py-4 whitespace-nowrap">{invoice.invoiceDate}</td>
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
