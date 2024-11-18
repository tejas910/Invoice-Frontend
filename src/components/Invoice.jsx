import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Header } from "./Header";
import { AddressInfo } from "./AddressInfo";
import { InvoiceTable } from "./InvoiceTable";
import { Summary } from "./Summary";
import { Footer } from "./Footer";
import { usePDF } from 'react-to-pdf';
function Invoice() {
  const { invoiceId } = useParams();
  console.log(invoiceId);
  const [invoiceData, setInvoiceData] = useState({});
  const [loading, setLoading] = useState(true);
  // const invoiceRef = useRef();  // Reference to the component for PDF generation
  const { toPDF, targetRef } = usePDF({filename: 'invoice.pdf'});
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
  // const generatePDF = async () => {
  //   const element = invoiceRef.current;
  //   await html2canvas(element, {
  //     backgroundColor: "#FFFFFF",
  //     scale: 2,
  //   }).then(async (canvas) => {
  //     const imgData = canvas.toDataURL("image/png");
  //     const pdf = new jsPDF("p", "mm", "a4");
  //     const pdfWidth = pdf.internal.pageSize.getWidth();
  //     const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
  //     // Add logo if it exists
  //     if (invoiceData.invoice.user.companyLogo) {
  //       const logoData = invoiceData.invoice.user.companyLogo;
  //       const logoWidth = 40; // Adjust width as needed
  //       const logoHeight = 20; // Adjust height as needed
  //       // Positioning logo at top right corner
  //       pdf.addImage(logoData, "PNG", pdfWidth - logoWidth - 10, 10, logoWidth, logoHeight);
  //     }
  //     // Add content below the logo
  //     const contentYPosition = 40; // Adjust this value based on your layout
  //     pdf.addImage(imgData, "PNG", 10, contentYPosition, pdfWidth - 20, pdfHeight);
  //     // Save the generated PDF
  //     pdf.save(`invoice_${invoiceId}.pdf`);
  //   });
  // };
  if (loading) {
    return <h1>Loading...</h1>;
  }
  return (
    <div>
        <button onClick={()=>toPDF()} className="bg-indigo-500 text-white px-4 py-2 rounded-md mt-2">Download PDF</button>
        <div ref={targetRef} className="max-w-4xl mx-auto p-8 bg-white shadow-xl rounded-lg">
            <Header invoice={invoice} />
            <AddressInfo user={invoice.user} client={invoice.client} shippingAddress={invoice.shippingAddress} />
            <InvoiceTable invoiceItems={invoice.invoiceItems} />
            <Summary invoice={invoice} />
            <Footer invoice={invoice} />
        </div>
    </div>
  );
}
export default Invoice;