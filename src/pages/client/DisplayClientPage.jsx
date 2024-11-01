import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const DisplayClientPage = () => {
    const [client, setClient] = useState(null);
    const [loading, setLoading] = useState(true); // Loading state
    const accesstoken = JSON.parse(localStorage.getItem("accesstoken"));
    const { id } = useParams();

    const fetchSingleClient = async () => {
        setLoading(true); // Start loading
        try {
            const res = await axios.get(`http://localhost:3000/api/customers/${id}`, {
                headers: { Authorization: `Bearer ${accesstoken}` },
            });
            if (res.status === 200) {
                setClient(res.data.result); // Assuming the client data is in res.data.result
            }
        } catch (err) {
            if (axios.isAxiosError(err)) {
                console.log(err.response?.data.message);
            }
        }
        setLoading(false); // End loading
    };

    useEffect(() => {
        fetchSingleClient();
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
                <h2 className="text-2xl font-bold mb-2">{client.firstName} {client.lastName}</h2>
                <p className="mb-2"><strong>Email:</strong> {client.email}</p>
                <p className="mb-2"><strong>Phone No:</strong> {client.phoneNo}</p>
            </div>

            <h3 className="text-xl font-semibold mb-2">Addresses:</h3>
            <div className="border rounded-lg shadow-lg p-4">
                {client.addresses.length > 0 ? (
                    client.addresses.map((address) => (
                        <div key={address.id} className="border-b last:border-b-0 pb-2 mb-2">
                            <p><strong>Street:</strong> {address.street}</p>
                            <p><strong>City:</strong> {address.city}</p>
                            <p><strong>State:</strong> {address.state}</p>
                            <p><strong>Country:</strong> {address.country}</p>
                            <p><strong>Post Code:</strong> {address.postCode}</p>
                        </div>
                    ))
                ) : (
                    <p>No addresses found.</p>
                )}
            </div>
        </div>
    );
};

export default DisplayClientPage;
