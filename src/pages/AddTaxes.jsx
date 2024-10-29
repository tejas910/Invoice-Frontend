import axios from 'axios';
import React, { useState } from 'react';

const AddTaxes = () => {
  const accesstoken = JSON.parse(localStorage.getItem("accesstoken"))
  const [formData, setFormData] = useState({
    name: '',
    hsnSacCode: '',
    description: '',
    gst: 0,
    cgst: 0,
    sgst: 0,
    igst: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    try{
      const gst = parseInt(formData.gst)
      const cgst = parseInt(formData.cgst)
      const sgst = parseInt(formData.sgst)
      const igst = parseInt(formData.igst)
      const res = await axios.post(`http://localhost:3000/api/taxes`,
         {
          name: formData.name,
          gst: gst,
          cgst: cgst, //optional
          sgst: sgst, //optional
          igst: igst, //optional
          hsnSacCode: formData.hsnSacCode, //optional
          description: formData.description //optiona
         }, {headers:{Authorization:`Bearer ${accesstoken}`}});
       if(res.status==200){
          console.log(res)
       }
    }catch(err){
      if(axios.isAxiosError(err)){
        console.log(err.response?.data.message)
      }
    }
    // console.log(formData);
    setFormData({
      name: '',
      hsnSacCode: '',
      description: '',
      gst: 0,
      cgst: 0,
      sgst: 0,
      igst: 0,
    });
  };

  return (
    <div className="p-6min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-4">Add New Tax</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">HSN/SAC Code</label>
            <input
              type="text"
              name="hsnSacCode"
              value={formData.hsnSacCode}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block mb-2">GST (%)</label>
            <input
              type="number"
              name="gst"
              value={formData.gst}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">CGST (%)</label>
            <input
              type="number"
              name="cgst"
              value={formData.cgst}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">SGST (%)</label>
            <input
              type="number"
              name="sgst"
              value={formData.sgst}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">IGST (%)</label>
            <input
              type="number"
              name="igst"
              value={formData.igst}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaxes;
