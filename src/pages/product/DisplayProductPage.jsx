import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const DisplayProductPage = () => {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true); // Loading state
    const accesstoken = JSON.parse(localStorage.getItem("accesstoken"));
    const { id } = useParams();

    const fetchSingleProduct = async () => {
        setLoading(true); // Start loading
        try {
            const res = await axios.get(`http://localhost:3000/api/products/${id}`, {
                headers: { Authorization: `Bearer ${accesstoken}` },
            });
            if (res.status === 200) {
                setProduct(res.data.product); // Assuming the product data is in res.data
            }
        } catch (err) {
            if (axios.isAxiosError(err)) {
                console.log(err.response?.data.message);
            }
        }
        setLoading(false); // End loading
    };

    useEffect(() => {
        fetchSingleProduct();
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
            <div className="border rounded-lg shadow-lg p-4">
                <h2 className="text-2xl font-bold mb-4">{product.productName}</h2>
                <p className="mb-2"><strong>Description:</strong> {product.productDescription}</p>
                <p className="mb-2"><strong>Price:</strong> Rs.{product.price}</p>
                <p className="mb-2"><strong>HSN Code:</strong> {product.hsnCode}</p>
                <p className="mb-2"><strong>Tax:</strong> {product.tax.name} ({product.tax.gst}%)</p>
                <p className="mb-2"><strong>Tax Description:</strong> {product.tax.description}</p>
                <p className="mb-2"><strong>HSN/SAC Code:</strong> {product.tax.hsnSacCode}</p>
            </div>
        </div>
    );
};

export default DisplayProductPage;
