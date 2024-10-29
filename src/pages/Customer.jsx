import React, { useEffect, useState } from 'react';
import { Search, Plus, Edit, Trash2, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Customer() {
  const accesstoken = JSON.parse(localStorage.getItem("accesstoken"));
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [resultsPerPage, setResultsPerPage] = useState(10);
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();
  const [status, setStatus] = useState(false);

  // Filter customers based on search term
  const filteredCustomers = customers.filter(customer => {
    return (
      customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const fetchClient = async () => {
    setLoading(true); // Start loading
    try {
      const res = await axios.get(`http://localhost:3000/api/customers`, {
        headers: { Authorization: `Bearer ${accesstoken}` },
      });
      if (res.status === 200) {
        console.log(res.data.result);
        setCustomers(res.data.result || []);
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.log(err.response?.data.message);
      }
    } finally {
      setLoading(false); // End loading
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleAddClient = () => {
    navigate('/addclient');
    console.log('Add client clicked');
  };

  const handleDeleteClient = async(id) => {
    try {
      const res = await axios.delete(`http://localhost:3000/api/customers/${id}`, { headers: { Authorization: `Bearer ${accesstoken}` } });
      if (res.status === 204) {
        setStatus(prev => !prev);
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.log(err.response?.data.message);
      }
    }
    console.log('Delete client', id);
  };

  useEffect(() => {
    fetchClient();
  }, [status]);

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
          onClick={handleAddClient}
          className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Client
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="loader"></div> {/* CSS spinner */}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone No.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id}>
                  <td className="px-6 py-4 whitespace-nowrap cursor-pointer" onClick={() => navigate(`/client/displayclient/${customer.id}`)}>
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img className="h-10 w-10 rounded-full" src={`https://ui-avatars.com/api/?name=${customer.firstName+customer.lastName}&background=random`} alt="" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{customer.firstName} {customer.lastName}</div>
                        <div className="text-sm text-gray-500">{customer.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {customer.invoices}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{customer.companyName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{customer.phoneNo}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => navigate(`/client/updateclient/${customer.id}`)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteClient(customer.id)}
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
      )}

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center">
          <span className="mr-2">Show</span>
          <div className="relative">
            <select
              value={resultsPerPage}
              onChange={(e) => setResultsPerPage(Number(e.target.value))}
              className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-8 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <ChevronDown className="absolute right-2 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <div>Showing {filteredCustomers.length} results</div>
      </div>

      <style>{`
        .loader {
          border: 4px solid rgba(0, 0, 0, 0.1);
          border-radius: 50%;
          border-top: 4px solid #3498db;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
