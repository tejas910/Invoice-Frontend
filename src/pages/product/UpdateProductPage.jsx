import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const UpdateProductPage = () => {
  const accesstoken = JSON.parse(localStorage.getItem("accesstoken"))
  const navigate = useNavigate()
  const [product, setProduct] = useState({
    productName: '',
    productDescription: '',
    hsnCode: '',
    price: 0,
    taxId: "",
  });
  const [taxName, setTaxName] = useState()
  const { id } = useParams(); 
  const handleSubmit = async (e) => {
    console.log(product.taxId)
    e.preventDefault();
    try {
      const res = await axios.put(`http://localhost:3000/api/products/${id}`, {
        productName: product.productName,
        productDescription: product.productDescription, //optional
        hsnCode: product.hsnCode, //optional
        price: Number(product.price),
        taxId: product.taxId
      },
        {
          headers: {
            Authorization: `Bearer ${accesstoken}`
          }
        }
      )
      if (res.status == 200) {
        navigate("/product")
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.log(err.response?.data.message)
      }
    }
  };

  const fetchProduct = async() =>{
    try{
        const res = await axios.get(`http://localhost:3000/api/products/${id}`,{headers:{Authorization: `Bearer ${accesstoken}`}})
        if(res.status==200){
            setProduct({
                productName:res.data.product.productName,
                productDescription:res.data.product.productDescription,
                hsnCode:res.data.product.hsnCode,
                price:res.data.product.price,
                taxId:res.data.product.tax.taxName
            })
        }
    }catch(err){
        if(axios.isAxiosError(err)){
            console.log(err.response?.data.message)
        }
    }
  }

  const fetchTaxes = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/taxes`, {
        headers: {
          Authorization: `Bearer ${accesstoken}`
        }
      })
      if (res.status == 200) {
        setTaxName(res.data.result)

      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.log(err.response?.data.message)
      }
    }

  }

  useEffect(() => {
    fetchTaxes();
    fetchProduct();
  }, [])

  if (!taxName) return <h1>Loading....</h1>
  return (
    <div className="container mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Update Product</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="product-name">Product Name*</label>
            <input
              id="product-name"
              type="text"
              value={product.productName}
              onChange={(e) => setProduct({ ...product, productName: e.target.value })}
              placeholder="Enter product name"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring focus:ring-indigo-500"
              required
            />
          </div>
          {/* Product Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="product-description">Description</label>
            <textarea
              id="product-description"
              value={product.productDescription}
              onChange={(e) => setProduct({ ...product, productDescription: e.target.value })}
              placeholder="Enter product description"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring focus:ring-indigo-500"
            />
          </div>
          {/* HSN Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="hsn-code">HSN Code</label>
            <input
              id="hsn-code"
              type="text"
              value={product.hsnCode}
              onChange={(e) => setProduct({ ...product, hsnCode: e.target.value })}
              placeholder="Enter HSN Code"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring focus:ring-indigo-500"
            />
          </div>
          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="price">Price*</label>
            <input
              id="price"
              type="number"
              value={product.price}
              onChange={(e) => setProduct({ ...product, price: e.target.value })}
              placeholder="Enter price"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring focus:ring-indigo-500"
              required
            />
          </div>
          {/* Tax */}
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="tax">Tax*</label>
            {taxName && taxName.map((item) => (
              <select
                id="tax"
                key={item.id}
                onChange={(e) => setProduct(prev => ({
                  ...prev,
                  taxId: e.target.value
                }))}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring focus:ring-indigo-500"
                required
              >
                <option value={""} className='text-black' >Select Tax</option>
                <option value={item.id} className='text-black' >{item.name}</option>

              </select>
            ))
            }
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button type="button" className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md">
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 text-white bg-indigo-600 rounded-md">
            Update Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProductPage;
