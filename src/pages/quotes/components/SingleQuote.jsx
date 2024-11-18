import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Header } from "./Header";
import { AddressInfo } from "../../../components/AddressInfo";
import { InvoiceTable } from "../../../components/InvoiceTable";
import { Summary } from "./Summary";
import { Footer } from "../../../components/Footer";

function SingleQuote() {
  const { quotesId } = useParams();
  const [quoteData, setQuoteData] = useState({});
  const [loading, setLoading] = useState(true);
  const quoteRef = useRef(); // Reference to the component for PDF generation

  const fetchQuoteData = async (quotesId) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/quotes/${quotesId}`,
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(
              localStorage.getItem("accesstoken") || ""
            )}`,
          },
        }
      );
      if (response.status === 200) {
        setQuoteData(response.data.result.quote);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchQuoteData(quotesId);
  }, [quotesId]);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div>
      <div
        ref={quoteRef}
        className="max-w-4xl mx-auto p-8 bg-white shadow-xl rounded-lg"
      >
        <Header quote={quoteData} />
        <AddressInfo
          user={quoteData.user}
          client={quoteData.client}
          shippingAddress={quoteData.shippingAddress}
        />
        <InvoiceTable invoiceItems={quoteData.quoteItems} />
        <Summary quote={quoteData} />
        <Footer invoice={quoteData} />
      </div>
    </div>
  );
}

export default SingleQuote;
