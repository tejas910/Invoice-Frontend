import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  ChevronDown,
  ChevronUp,
  Download,
  Trash2,
  Edit2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import axios from "axios";
import debounce from "lodash.debounce";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
export default function Quotes() {
  const [quotes, setQuotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const accesstoken = JSON.parse(localStorage.getItem("accesstoken"));
  const navigate = useNavigate();

  const fetchQuotes = async (page = 1, limit = 10) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:3000/api/quotes?page=${page}&limit=${limit}`,
        {
          headers: { Authorization: `Bearer ${accesstoken}` },
        }
      );
      if (res.status === 200) {
        const newQuotes = res.data.result || [];
        setQuotes((prev) => (page === 1 ? newQuotes : [...prev, ...newQuotes]));
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
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(async(result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success"
        });
        try {
          const res = await axios.delete(`http://localhost:3000/api/quotes/${id}`, {
            headers: { Authorization: `Bearer ${accesstoken}` },
          });
          if (res.status === 204) {
            toast.error("Quotes Deleted", { position: "top-right" });
            setQuotes((prev) => prev.filter((quote) => quote.id !== id));
          }
        } catch (err) {
          if (axios.isAxiosError(err)) {
            console.log(err.response?.data.message);
          }
        }
      }
    });
  };

  const handleSort = (key) => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig.key === key && prevConfig.direction === "ascending"
          ? "descending"
          : "ascending",
    }));
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(quotes);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Quotes");
    XLSX.writeFile(workbook, "quotes.xlsx");
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );


  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="pl-10 pr-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        <div className="flex items-center space-x-4">
          <input
            type="date"
            className="border rounded-md px-3 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            value={dateRange.start}
            onChange={(e) =>
              setDateRange((prev) => ({ ...prev, start: e.target.value }))
            }
          />
          <input
            type="date"
            className="border rounded-md px-3 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            value={dateRange.end}
            onChange={(e) =>
              setDateRange((prev) => ({ ...prev, end: e.target.value }))
            }
          />
          <button
            onClick={exportToExcel}
            className="flex items-center space-x-1 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 shadow-md"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
          <Link
            to={"/quotes/addquotes"}
            className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 shadow-md"
          >
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
                <th
                  onClick={() => handleSort("quoteNumber")}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-blue-600"
                >Quote No.</th>
                {["client", "quoteDate", "quoteDueDate"].map((key) => (
                  <th
                    key={key}
                    onClick={() => handleSort(key)}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-blue-600"
                  >
                    {key.charAt(0).toUpperCase() +
                      key.slice(1).replace(/([A-Z])/g, " $1")}
                    {sortConfig.key === key ? (
                      sortConfig.direction === "ascending" ? (
                        <ChevronUp className="inline h-4 w-4 ml-1" />
                      ) : (
                        <ChevronDown className="inline h-4 w-4 ml-1" />
                      )
                    ) : (
                      <ChevronDown className="inline h-4 w-4 ml-1 opacity-50" />
                    )}
                  </th>
                ))}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {quotes.map((quote) => (
                <tr key={quote.id} className="hover:bg-gray-100">
                  <td
                    className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                    onClick={() => navigate(`/quotes/${quote.id}`)}
                  >{quote.quoteNumber}</td>
                  <td
                    className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                    onClick={() => navigate(`/quotes/${quote.id}`)}
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          loading="lazy"
                          className="h-10 w-10 rounded-full"
                          src={`https://ui-avatars.com/api/?name=${quote.client.firstName}`}
                          alt=""
                        />
                      </div>
                      <div className="ml-4">
                        <div>
                          {quote.client.firstName} {quote.client.lastName}
                        </div>
                        <div className="text-gray-500 text-sm">
                          {quote.client.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(quote.quoteDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(quote.quoteDueDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 inline-flex text-xs font-semibold rounded-full ${
                        quote.status === "Accepted"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {quote.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => deleteQuote(quote.id)}
                      className="text-red-600 hover:text-red-800 mr-3"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() =>
                        navigate(`/quotes/updatequote/${quote.id}`)
                      }
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {hasMore && !loading && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setPage((prev) => prev + 1)}
            className="px-6 py-2 bg-gray-300 hover:bg-gray-400 rounded-md shadow-md"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}
