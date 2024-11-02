import React, { useState, useEffect, useCallback } from 'react';
import { Search, ChevronDown, Download, Trash2, Edit2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import axios from 'axios';
import debounce from 'lodash.debounce';

export default function Quotes() {
  const [quotes, setQuotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true); // Loading state
  const accesstoken = JSON.parse(localStorage.getItem("accesstoken"));
  const navigate = useNavigate();

  const fetchQuotes = async (page = 1, limit = 10) => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:3000/api/quotes?page=${page}&limit=${limit}`, {
        headers: { Authorization: `Bearer ${accesstoken}` }
      });
      if (res.status === 200) {
        const newQuotes = res.data.result || [];
        setQuotes(prev => page === 1 ? newQuotes : [...prev, ...newQuotes]);
        setHasMore(newQuotes.length === limit);
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.log(err.response?.data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes(page);
  }, [page]);

  const debouncedFetchQuotes = useCallback(
    debounce(() => {
      setPage(1);
      fetchQuotes(1);
    }, 300),
    [searchTerm, dateRange, sortConfig]
  );

  useEffect(() => {
    debouncedFetchQuotes();
    return () => debouncedFetchQuotes.cancel();
  }, [searchTerm, dateRange, sortConfig, debouncedFetchQuotes]);

  const deleteQuote = async (id) => {
    try {
      const res = await axios.delete(`http://localhost:3000/api/quotes/${id}`, {
        headers: { Authorization: `Bearer ${accesstoken}` }
      });
      if (res.status === 204) {
        setQuotes((prev) => prev.filter((quote) => quote.id !== id));
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.log(err.response?.data.message);
      }
    }
  };

  const handleSort = (key) => {
    setSortConfig((prevConfig) => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'ascending' ? 'descending' : 'ascending',
    }));
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(quotes);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Quotes');
    XLSX.writeFile(workbook, 'quotes.xlsx');
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="pl-10 pr-4 py-2 border rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        <div className="flex items-center space-x-4">
          <input
            type="date"
            className="border rounded-md px-3 py-2"
            value={dateRange.start}
            onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
          />
          <input
            type="date"
            className="border rounded-md px-3 py-2"
            value={dateRange.end}
            onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
          />
          <button
            onClick={exportToExcel}
            className="flex items-center space-x-1 bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
          <Link to={'/quotes/addquotes'} className="bg-indigo-500 text-white px-4 py-2 rounded-md">
            New Quote
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th onClick={() => handleSort('client')}>Client <ChevronDown className="inline h-4 w-4" /></th>
                <th onClick={() => handleSort('quoteDate')}>Quote Date <ChevronDown className="inline h-4 w-4" /></th>
                <th onClick={() => handleSort('quoteDueDate')}>Due Date <ChevronDown className="inline h-4 w-4" /></th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {quotes.map((quote) => (
                <tr key={quote.id}>
                  <td onClick={() => navigate(`/quotes/${quote.id}`)}>
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img loading="lazy" className="h-10 w-10 rounded-full" src={`https://ui-avatars.com/api/?name=${quote.client.firstName}`} alt="" />
                      </div>
                      <div className="ml-4">
                        <div>{quote.client.firstName} {quote.client.lastName}</div>
                        <div>{quote.client.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>{new Date(quote.quoteDate).toLocaleDateString()}</td>
                  <td>{new Date(quote.quoteDueDate).toLocaleDateString()}</td>
                  <td>
                    <span className={`px-2 inline-flex text-xs font-semibold rounded-full ${quote.status === 'Accepted' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {quote.status}
                    </span>
                  </td>
                  <td>
                    <button onClick={() => deleteQuote(quote.id)}><Trash2 className="h-5 w-5" /></button>
                    <button onClick={() => navigate(`/quotes/updatequote/${quote.id}`)}><Edit2 className="h-5 w-5" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {hasMore && !loading && (
        <div className="flex justify-center mt-6">
          <button onClick={() => setPage(prev => prev + 1)} className="px-4 py-2 bg-blue-500 text-white rounded-md">
            Load More
          </button>
        </div>
      )}
    </div>
  );
}
