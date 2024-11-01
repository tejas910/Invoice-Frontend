import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Header } from "./Header";
import { AddressInfo } from "./AddressInfo";
import { InvoiceTable } from "./InvoiceTable";
import { Summary } from "./Summary";
import { Footer } from "./Footer";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
function QuotePdf() {
  const { quotesId } = useParams();
  console.log(quotesId);
  const [invoiceData, setInvoiceData] = useState({});
  const [loading, setLoading] = useState(true);
  const invoiceRef = useRef();  // Reference to the component for PDF generation

  const fetchInvoiceData = async (quotesId) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/quotes/${quotesId}`,
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("accesstoken"))}`,
          },
        }
      );
      if (response.status === 200) {
        setInvoiceData(response.data.result.quote);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchInvoiceData(quotesId);
  }, [quotesId]);

  const { invoice } = invoiceData;

  const generatePDF = async () => {
    const element = invoiceRef.current;
  
    // Temporarily remove background and shadow styles
    const originalBackground = element.style.background;
    const originalBoxShadow = element.style.boxShadow;
    element.style.backgroundColor = "white";  // Set white background to avoid grey
    element.style.boxShadow = "none";         // Remove shadow
  
    // Capture the canvas without any background color or shadow
    const canvas = await html2canvas(element, { backgroundColor: "#ffffff" });  // Explicitly set to white
    const imgData = canvas.toDataURL("image/png");
  
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
  
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`invoice_${invoiceId}.pdf`);
  
    // Restore original styles after PDF generation
    element.style.background = originalBackground;
    element.style.boxShadow = originalBoxShadow;
  };
  
  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div>
        <button onClick={generatePDF} className="bg-indigo-500 text-white px-4 py-2 rounded-md mt-2">Download PDF</button>
        <div ref={invoiceRef} className="max-w-4xl mx-auto p-8 bg-white shadow-xl rounded-lg">
            <Header invoice={invoice} />
            <AddressInfo user={invoice.user} client={invoice.client} shippingAddress={invoice.shippingAddress} />
            <InvoiceTable invoiceItems={invoice.invoiceItems} />
            <Summary invoice={invoice} />
            <Footer invoice={invoice} />
        </div>
    </div>
  );
}

export default QuotePdf;
