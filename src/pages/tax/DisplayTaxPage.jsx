import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const DisplayTaxPage = () => {
    const [tax, setTax] = useState(null);
    const [loading, setLoading] = useState(true); // Loading state
    const accesstoken = JSON.parse(localStorage.getItem("accesstoken"));
    const { id } = useParams();

    const fetchSingleTax = async () => {
        setLoading(true); // Start loading
        try {
            const res = await axios.get(`http://localhost:3000/api/taxes/${id}`, {
                headers: { Authorization: `Bearer ${accesstoken}` },
            });
            if (res.status === 200) {
                setTax(res.data.tax); // Assuming the tax data is in res.data
            }
        } catch (err) {
            if (axios.isAxiosError(err)) {
                console.log(err.response?.data.message);
            }
        }
        setLoading(false); // End loading
    };

    useEffect(() => {
        fetchSingleTax();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div style={{
                    border: '4px solid #f3f3f3',
                    borderTop: '4px solid #3498db',
                    borderRadius: '50%',
                    width: '36px',
                    height: '36px',
                    animation: 'spin 0.8s linear infinite',
                }} />
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6">
            <div className="border rounded-lg shadow-lg p-4 mb-4">
                <h2 className="text-2xl font-bold mb-2">{tax.name}</h2>
                <p className="mb-2"><strong>HSN/SAC Code:</strong> {tax.hsnSacCode}</p>
                <p className="mb-2"><strong>Description:</strong> {tax.description}</p>
                <p className="mb-2"><strong>GST Rate:</strong> {tax.gst}%</p>
                <p className="mb-2"><strong>CGST Rate:</strong> {tax.cgst}%</p>
                <p className="mb-2"><strong>SGST Rate:</strong> {tax.sgst}%</p>
                <p className="mb-2"><strong>IGST Rate:</strong> {tax.igst}%</p>
            </div>
        </div>
    );
};

export default DisplayTaxPage;
