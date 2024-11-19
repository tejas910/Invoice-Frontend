import React, { useState, useEffect } from "react";
import {
  Search,
  ChevronDown,
  Download,
  MoreVertical,
  RefreshCw,
  Trash2,
  Edit2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import axios from "axios";
import Pagination from "../../common/Pagination"; // Import your Pagination component
import { toast } from "react-toastify";
import Swal from 'sweetalert2'
const InvoicePage = () => {
  const [invoices, setInvoices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [clientName, setClientName] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const accesstoken = JSON.parse(localStorage.getItem("accesstoken"));
  const [statusUpdate, setStatusUpdate] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();

  useEffect(() => {
    fetchInvoices();
  }, [
    searchTerm,
    dateRange,
    clientName,
    sortConfig,
    statusUpdate,
    currentPage,
  ]);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:3000/api/invoices`, {
        headers: { Authorization: `Bearer ${accesstoken}` },
        params: {
          startInvoiceDate: dateRange.start,
          endInvoiceDate: dateRange.end,
          clientName,
          page: currentPage,
          limit: 10, // Set a limit for pagination
        },
      });
      if (res.status === 200) {
        setInvoices(res.data.result || []);
        setTotalPages(res.data.totalPages); // Update total pages based on response
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.log(err.response?.data.message);
      }
    }
    setLoading(false);
  };

  const deleteInvoice = async (id) => {
  
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
          const res = await axios.delete(
            `http://localhost:3000/api/invoices/${id}`,
            {
              headers: { Authorization: `Bearer ${accesstoken}` },
            }
          );
          if (res.status === 204) {
            setStatusUpdate((prev) => !prev);
            toast.error("Invoice Deleted",{position:"top-right"})
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
    const worksheet = XLSX.utils.json_to_sheet(invoices);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Invoices");
    XLSX.writeFile(workbook, "invoices.xlsx");
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
            onChange={(e) =>
              setDateRange((prev) => ({ ...prev, start: e.target.value }))
            }
          />
          <input
            type="date"
            className="border rounded-md px-3 py-2"
            value={dateRange.end}
            onChange={(e) =>
              setDateRange((prev) => ({ ...prev, end: e.target.value }))
            }
          />
          <input
            type="text"
            placeholder="Client Name"
            className="border rounded-md px-3 py-2"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
          />
          <button
            onClick={exportToExcel}
            className="flex items-center space-x-1 bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
          <Link
            to={"/addinvoice"}
            className="bg-indigo-500 text-white px-4 py-2 rounded-md"
          >
            New Invoice
          </Link>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("client")}
              >
                Client <ChevronDown className="inline h-4 w-4" />
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("invoiceNumber")}
              >
                Invoice No. <ChevronDown className="inline h-4 w-4" />
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("invoiceDate")}
              >
                Invoice Date <ChevronDown className="inline h-4 w-4" />
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("dueDate")}
              >
                Due Date <ChevronDown className="inline h-4 w-4" />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {invoices.map((invoice) => (
              <tr key={invoice.id}>
                <td className="px-6 py-4 whitespace-nowrap cursor-pointer">
                  <div
                    className="flex items-center"
                    onClick={() => navigate(`/invoice/${invoice.id}`)}
                  >
                    <div className="flex-shrink-0 h-10 w-10">
                      <img
                        className="h-10 w-10 rounded-full"
                        src={`https://ui-avatars.com/api/?name=${invoice.client.firstName + " " + invoice.client.lastName}&background=random`}
                        alt=""
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {invoice.client.firstName} {invoice.client.lastName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {invoice.client.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {invoice.invoiceNumber}
                  </div>{" "}
                  {/* Format date */}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {new Date(invoice.invoiceDate).toLocaleDateString()}
                  </div>{" "}
                  {/* Format date */}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {new Date(invoice.invoiceDueDate).toLocaleDateString()}
                  </div>{" "}
                  {/* Format date */}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {/* Status formatting */}
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      invoice.status === "Paid"
                        ? "bg-green-100 text-green-800"
                        : invoice.status === "Partially Paid"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {invoice.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {/* Action buttons */}
                  <button
                    onClick={() => deleteInvoice(invoice.id)}
                    className="text-indigo-600 hover:text-indigo-900 mr-2"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() =>
                      navigate(`/invoice/updateinvoice/${invoice.id}`)
                    }
                    className="text-gray-600 hover:text-gray-900"
                  >
                    <Edit2 className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Component */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      )}
    </div>
  );
};

export default InvoicePage;
