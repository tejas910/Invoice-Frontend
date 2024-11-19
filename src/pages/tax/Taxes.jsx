import { useState, useEffect } from 'react'
import { Search, Plus, Edit, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
export default function Taxes() {
  const [taxes, setTaxes] = useState([])
  const [loading, setLoading] = useState(false) // Loading state
  const accesstoken = JSON.parse(localStorage.getItem("accesstoken"))
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [status, setStatus] = useState(false)

  const filteredTaxes = taxes.filter(tax =>
    tax.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const indexOfLastTax = currentPage * itemsPerPage
  const indexOfFirstTax = indexOfLastTax - itemsPerPage
  const currentTaxes = filteredTaxes.slice(indexOfFirstTax, indexOfLastTax)
  const totalPages = Math.ceil(filteredTaxes.length / itemsPerPage)

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  const handleDelete = async (id) => {
    console.log(id)
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success"
        });
        try {
          const res = await axios.delete(`http://localhost:3000/api/taxes/${id}`, {
            headers: { Authorization: `Bearer ${accesstoken}` }
          })
          if (res.status === 204) {
            toast.error("Tax Deleted Successfully", { position: "top-right" })
            setStatus(prev => !prev)
          }
        } catch (err) {
          if (axios.isAxiosError(err)) {
            console.log(err.response?.data.message)
          }
        }
      }
    });
  }

  const fetchTaxes = async () => {
    setLoading(true) // Set loading to true before fetching data
    try {
      const res = await axios.get(`http://localhost:3000/api/taxes`, {
        headers: {
          Authorization: `Bearer ${accesstoken}`
        }
      })
      if (res.status === 200) {
        console.log(res.data.result)
        setTaxes(res.data.result || [])
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.log(err.response?.data.message)
      }
    } finally {
      setLoading(false) // Set loading to false after fetching data
    }
  }

  useEffect(() => {
    fetchTaxes()
  }, [status])

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );


  return (
    <div className="p-6 min-h-screen">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          </div>
          <button onClick={() => navigate("/taxes/Addtax")} className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center">
            <Plus size={20} className="mr-2" />
            Add Tax
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="loader"></div> {/* CSS spinner */}
          </div>
        ) : (
          <>
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">NAME</th>
                  <th className="text-left py-2">GST</th>
                  <th className="text-left py-2">SGST</th>
                  <th className="text-left py-2">IGST</th>
                  <th className="text-left py-2">CGST</th>
                  <th className="text-left py-2">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {currentTaxes && currentTaxes.map((tax, index) => (
                  <tr key={index} className="border-b cursor-pointer" onClick={() => navigate(`/taxes/displaytax/${tax.id}`)}>
                    <td className="py-4">{tax.name}</td>
                    <td>{tax.gst}</td>
                    <td>{tax.sgst}</td>
                    <td>{tax.igst}</td>
                    <td>{tax.cgst}</td>
                    <td>
                      <button onClick={(e) => { e.stopPropagation(); navigate(`/taxes/updatetax/${tax.id}`); }} className="text-blue-500 mr-2">
                        <Edit size={20} />
                      </button>
                      <button className="text-red-500" onClick={(e) => { e.stopPropagation(); handleDelete(tax.id); }}>
                        <Trash2 size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-between items-center mt-6">
              <div>
                <span className="mr-2">Show</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value))
                    setCurrentPage(1) // Reset to first page
                  }}
                  className="border rounded px-2 py-1"
                >
                  <option>10</option>
                  <option>20</option>
                  <option>50</option>
                </select>
                <span className="ml-2">
                  Showing {indexOfFirstTax + 1} to {Math.min(indexOfLastTax, filteredTaxes.length)} of {filteredTaxes.length} results
                </span>
              </div>
              <div className="flex">
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => handlePageChange(index + 1)}
                    className={`px-3 py-1 mx-1 rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'
                      }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
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
  )
}
