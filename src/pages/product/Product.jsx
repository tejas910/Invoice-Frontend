import React, { useEffect, useState } from 'react';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Product() {
  const accesstoken = JSON.parse(localStorage.getItem("accesstoken"));
  
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(5);
  const [sortOrder, setSortOrder] = useState('asc');
  const [sortBy, setSortBy] = useState('name');
  const [status, setStatus] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  const fetchProduct = async () => {
    setLoading(true); // Start loading
    try {
      const res = await axios.get(`http://localhost:3000/api/products`, {
        headers: {
          Authorization: `Bearer ${accesstoken}`
        }
      });
      if (res.status === 200) {
        setProducts(res.data.result || []);
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.log(err.response?.data.message);
      }
    } finally {
      setLoading(false); // End loading
    }
  };

  const filteredProducts = products
    .filter(product => {
      const nameMatches = product.name && product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const idMatches = product.id && product.id.toLowerCase().includes(searchTerm.toLowerCase());
      return nameMatches || idMatches;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'name') {
        const nameA = a.name ? a.name : '';
        const nameB = b.name ? b.name : '';
        comparison = nameA.localeCompare(nameB);
      } else if (sortBy === 'price') {
        comparison = a.price - b.price;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const indexOfLastProduct = currentPage * resultsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - resultsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleAddProduct = () => {
    navigate("/addproduct");
  };

  const handleDeleteProduct = async(id) => {
    try{
      const res = await axios.delete(`http://localhost:3000/api/products/${id}`, { headers: { Authorization: `Bearer ${accesstoken}` } });
      if(res.status === 204){
        setStatus(prev => !prev);
      }
    }catch(err){
      if(axios.isAxiosError(err)){
        console.log(err.response?.data.message);
      }
    }
  };

  const handleSort = (criteria) => {
    if (sortBy === criteria) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(criteria);
      setSortOrder('asc');
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(filteredProducts.length / resultsPerPage);

  useEffect(() => {
    fetchProduct();
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
          onClick={handleAddProduct}
          className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Product
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center cursor-pointer" onClick={() => handleSort('name')}>
                    Product Name
                    {sortBy === 'name' && (sortOrder === 'asc' ? ' 🔼' : ' 🔽')}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center cursor-pointer" onClick={() => handleSort('price')}>
                    Price
                    {sortBy === 'price' && (sortOrder === 'asc' ? ' 🔼' : ' 🔽')}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentProducts.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap cursor-pointer" onClick={() => navigate(`/product/displayproduct/${product.id}`)}>
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img className="h-10 w-10 rounded-full" src={`https://ui-avatars.com/api/?name=${product.productName}&background=random`} alt="" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{product.productName}</div>
                        <div className="text-sm text-gray-500">{product.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{product.price} /-</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button onClick={() => navigate(`/product/updateproduct/${product.id}`)} className="text-indigo-600 hover:text-indigo-900 mr-4">
                      <Edit className="h-5 w-5" />
                    </button>
                    <button onClick={() => handleDeleteProduct(product.id)} className="text-red-600 hover:text-red-900">
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
        <div>
          <span className="mr-2">Show</span>
          <select
            value={resultsPerPage}
            onChange={(e) => {
              setResultsPerPage(Number(e.target.value));
              setCurrentPage(1);
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
        <div>Showing {currentProducts.length} of {filteredProducts.length} results</div>
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
