import { format } from 'date-fns';
import {CreditCard ,Calendar, FileText } from 'lucide-react';
import Logo from '../Images/LOGO.jpg'
// Helper functions
const formatDate = (dateString) => format(new Date(dateString), 'dd MMM yyyy');



export const Header = ({ invoice }) => (
    <div className="flex justify-between items-start mb-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Invoice</h1>
        <p className="text-sm text-gray-600 mb-1">Generated on: {formatDate(new Date().toISOString())}</p>
        <div className="flex items-center text-sm text-gray-600 mb-1">
          <FileText className="w-4 h-4 mr-2" />
          <span>Invoice Number: <b>{invoice.invoiceNumber}</b></span>
        </div>
        <div className="flex items-center text-sm text-gray-600 mb-1">
          <Calendar className="w-4 h-4 mr-2" />
          <span>Invoice Date: <b>{formatDate(invoice.invoiceDate)}</b></span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="w-4 h-4 mr-2" />
          <span>Due Date: <b>{formatDate(invoice.invoiceDueDate)}</b></span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <CreditCard className="w-4 h-4 mr-2" />
          <span>Status: <b>{invoice.status === "Partially_Paid" ? "Partially Paid": invoice.status}</b></span>
        </div>
      </div>
      {invoice.user.companyLogo && (
        <div className='w-52 h-40 m-1 flex justify-center items-center'>
          <img src={Logo} alt="Company Logo" className="object-contain" />
        </div>
      )}
    </div>
  );