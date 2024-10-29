import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Header } from "./Header";
import { AddressInfo } from "./AddressInfo";
import { InvoiceTable } from "./InvoiceTable";
import { Summary } from "./Summary";
import { Footer } from "./Footer";

function Invoice() {
  const { invoiceId } = useParams();
  console.log(invoiceId);
  const [invoiceData, setInvoiceData] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchInvoiceData = async (invoiceId) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/invoices/${invoiceId}`,
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("accesstoken"))}`,
          },
        }
      );
      if (response.status === 200) {
        setInvoiceData(response.data.result);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchInvoiceData(invoiceId);
  }, [invoiceId]);

  const { invoice } = invoiceData;

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-xl rounded-lg">
      <Header invoice={invoice} />
      <AddressInfo user={invoice.user} client={invoice.client} shippingAddress={invoice.shippingAddress} />
      <InvoiceTable invoiceItems={invoice.invoiceItems} />
      <Summary invoice={invoice} />
      <Footer invoice={invoice} />
    </div>
  );
}

export default Invoice;
